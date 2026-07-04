import { createClient } from "redis";
import fs from "fs/promises";
import { exec } from "child_process";
import util from "util";

// Convert callback-based exec to Promise-based
const execPromise = util.promisify(exec);

const client = createClient();

client.connect()
    .then(async () => {
        console.log("Worker is running and waiting for jobs...");

        while (1) {
            const response = await client.rPop("problems");
            if (!response) {
                await new Promise((r) => setTimeout(r, 1000));
                continue;
            }

            const parsedResponse = JSON.parse(response);
            console.log("\nReceived job from Redis:", parsedResponse);

            const code = parsedResponse.code;
            const language = parsedResponse.language;
            const submissionId = parsedResponse.submissionId;

            // Handle both "c++" and "cpp" string variations
            if (language === "c++" || language === "cpp") {
                console.log(`Running C++ code for job ${submissionId}`);

                const cppFileName = `temp_${submissionId}.cpp`;
                const exeFileName = `temp_${submissionId}.exe`; // .exe for Windows
                let output = "";

                try {
                    // 1. Write the code to a temporary file
                    await fs.writeFile(cppFileName, code);

                    // 2. Compile the code natively on Windows
                    await execPromise(`g++ ${cppFileName} -o ${exeFileName}`);

                    // 3. Execute the binary with a timeout
                    const { stdout } = await execPromise(exeFileName, { timeout: 5000 });
                    output = stdout;
                    console.log("Execution Output:\n", output);

                    // 4. Save success to Redis for 1 hour
                    await client.setEx(`result:${submissionId}`, 3600, JSON.stringify({
                        status: "Success",
                        output: output
                    }));

                } catch (error) {
                    // Catch compilation errors, runtime errors, or timeouts
                    const err = error as any;
                    output = err.stderr || err.message || "Unknown execution error";
                    console.error("Compilation/Execution Error:\n", output);

                    // Save error to Redis for 1 hour
                    await client.setEx(`result:${submissionId}`, 3600, JSON.stringify({
                        status: "Error",
                        output: output
                    }));
                } finally {
                    // 5. Cleanup temp files so your hard drive doesn't fill up
                    try {
                        await fs.unlink(cppFileName).catch(() => { });
                        await fs.unlink(exeFileName).catch(() => { });
                    } catch (cleanupError) {
                        console.error("Failed to clean up files", cleanupError);
                    }
                }
            }
        }
    })
    .catch(console.error);
