import express from 'express';
import { createClient } from 'redis';
import crypto from 'crypto';

const client = createClient();

// Add error listener for Redis
client.on('error', (err) => console.error('Redis Client Error', err));

// Await connection before starting the server
await client.connect();

const app = express();
app.use(express.json());

app.post('/submission', async (req, res) => {
    try {
        const userId = req.body.userId;
        const questionId = req.body.questionId;
        const code = req.body.code;
        const language = req.body.language;

        // Generate a unique ID for this submission
        const submissionId = crypto.randomUUID();

        // Push to Redis queue
        const payload = { submissionId, userId, questionId, code, language };
        await client.lPush("problems", JSON.stringify(payload));

        console.log(`Job ${submissionId} pushed to Redis!`);

        res.json({
            message: "processing",
            submissionId: submissionId
        });
    } catch (error) {
        console.error("Failed to push to Redis:", error);
        res.status(500).json({ error: "Internal Server Error: Could not queue job" });
    }
});

app.get('/submission/:submissionId', async (req, res) => {
    try {
        const submissionId = req.params.submissionId;

        // Check Redis for the result
        const result = await client.get(`result:${submissionId}`);

        if (!result) {
            // Still in the queue or compiling
            return res.json({ status: "Pending" });
        }

        // Job finished (either success or compilation/runtime error)
        const parsedResult = JSON.parse(result);
        res.json(parsedResult);

    } catch (error) {
        console.error("Error fetching result:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000, ready to receive submissions!");
});
