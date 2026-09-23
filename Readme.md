<div align="center">

# CraftCode

### A small distributed code-execution platform built to learn backend systems.

CraftCode is a work-in-progress coding platform where users can submit C++, JavaScript, or Python code from a React frontend. Submissions are queued through Redis and processed asynchronously by a separate worker that compiles or executes the code and records the result.

</div>

---

## What is CraftCode?
A web-based code execution platform that allows users to write, compile, and execute code in real time across multiple programming languages, including C++, JavaScript, Python, and more.
CraftCode started as a project to understand how online code execution systems work behind the scenes.

Instead of making the API server compile and execute user code directly, the project separates the work into three parts:

1. **Frontend** — accepts code and a programming language from the user.
2. **Backend API** — receives a submission and pushes it into a Redis queue.
3. **Worker** — consumes queued submissions, runs the code, captures the output, and updates the submission status.

The main idea behind the project is to explore asynchronous job processing and the producer-consumer pattern used in backend systems.

---

## Current Features

- Submit code through a React + TypeScript frontend
- Select between C++, JavaScript, and Python
- Express API for accepting code submissions
- Unique submission IDs for queued jobs
- Redis-backed submission queue
- Separate worker process for code execution
- C++ compilation using `g++`
- JavaScript execution using Node.js
- Python execution using Python
- Capture program `stdout`
- Track execution status using Prisma and PostgreSQL
- Basic frontend polling flow for submission results

---

## Architecture

```text
                  POST /submission
┌──────────────┐  ────────────────▶  ┌──────────────┐
│              │                     │              │
│ React Client │                     │ Express API  │
│              │                     │              │
└──────────────┘                     └──────┬───────┘
                                           │
                                           │ LPUSH
                                           ▼
                                    ┌──────────────┐
                                    │    Redis     │
                                    │    Queue     │
                                    └──────┬───────┘
                                           │
                                           │ RPOP
                                           ▼
                                    ┌──────────────┐
                                    │    Worker    │
                                    └──────┬───────┘
                                           │
                         ┌─────────────────┼─────────────────┐
                         ▼                 ▼                 ▼
                       g++               Node.js           Python
                         │                 │                 │
                         └─────────────────┼─────────────────┘
                                           ▼
                                    ┌──────────────┐
                                    │ PostgreSQL   │
                                    │   + Prisma   │
                                    └──────────────┘
```

The backend acts as the **producer**, Redis acts as the **job queue**, and the worker acts as the **consumer**.

---

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS |
| UI | Radix UI components |
| HTTP client | Axios |
| Backend | Express 5, TypeScript |
| Runtime / tooling | Bun |
| Queue | Redis |
| Worker | TypeScript + Node child processes |
| Database | PostgreSQL |
| ORM | Prisma |
| C++ execution | `g++` |
| JavaScript execution | Node.js |
| Python execution | Python |

---

## Repository Structure

```text
CraftCode/
├── backend/
│   ├── index.ts
│   ├── package.json
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── APITester.tsx
│   │   └── components/
│   ├── package.json
│   └── build.ts
│
├── worker/
│   ├── index.ts
│   ├── db.ts
│   ├── code/
│   ├── package.json
│   └── prisma/
│       └── schema.prisma
│
└── Readme.md
```

---

## Submission Flow

### 1. User submits code

The frontend sends the source code and selected language to:

```http
POST /submission
```

Example request:

```json
{
  "code": "print('Hello from CraftCode')",
  "language": "py"
}
```

### 2. Backend queues the job

The API generates a UUID and pushes the submission payload into the Redis list:

```text
problems
```

The payload also supports `userId` and `questionId`, although the current frontend does not provide them.

### 3. Worker processes the submission

The worker continuously consumes jobs from Redis.

Depending on the language, it:

- writes C++ code to a `.cpp` file and compiles it with `g++`
- writes JavaScript code to a `.js` file and runs it with Node.js
- writes Python code to a `.py` file and runs it with Python

The worker captures standard output and marks submissions as `Processing`, `Success`, or `Failure` in its Prisma-backed database flow.

---

## Local Development

### Prerequisites

You currently need:

- [Bun](https://bun.sh/)
- Redis running locally on the default Redis port
- PostgreSQL
- Node.js
- Python
- `g++`

### Clone the repository

```bash
git clone https://github.com/Sriram-Nambiar/CraftCode.git
cd CraftCode
```

### Start Redis

For example, if Redis is installed locally:

```bash
redis-server
```

### Configure PostgreSQL

Set a `DATABASE_URL` environment variable for the worker:

```bash
export DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE"
```

On Windows PowerShell:

```powershell
$env:DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE"
```

### Install dependencies

```bash
cd backend
bun install

cd ../worker
bun install

cd ../frontend
bun install
```

### Generate the Prisma client

From the worker directory:

```bash
bunx prisma generate
```

Configure PostgreSQL before applying any Prisma schema or migration changes.

### Start the backend

```bash
cd backend
bun index.ts
```

The backend listens on:

```text
http://localhost:3000
```

### Start the worker

In another terminal:

```bash
cd worker
bun index.ts
```

### Start the frontend

In another terminal:

```bash
cd frontend
bun run dev
```

The frontend development server is configured to run on:

```text
http://localhost:3003
```

---

## API

### Submit code

```http
POST /submission
```

Request shape:

```json
{
  "userId": "optional/currently not supplied by the UI",
  "questionId": "optional/currently not supplied by the UI",
  "code": "source code",
  "language": "cpp | js | py"
}
```

Response:

```json
{
  "message": "processing",
  "submissionId": "generated-uuid"
}
```

### Check a submission

```http
GET /submission/:submissionId
```

The repository contains an early implementation of result polling. The result-storage path between the API and worker still needs to be unified before this flow is fully reliable.

---

## Current Limitations

CraftCode is an early-stage learning project and is **not safe for production use yet**.

Important limitations include:

- **No sandboxing:** submitted programs are currently executed directly on the worker machine.
- **No execution timeout:** an infinite loop can keep running indefinitely.
- **No CPU or memory limits.**
- **No isolated filesystem.**
- **No test-case / stdin judging system yet.**
- **No detailed compilation or runtime error output in the UI.**
- **Single shared source filenames:** concurrent submissions could overwrite each other's temporary files.
- **Result storage is not fully unified:** the backend currently looks for results in Redis while the worker updates PostgreSQL.
- **Frontend/API response naming needs cleanup:** the frontend expects `id` while the backend returns `submissionId`.
- **Authentication and user-specific submissions are not implemented yet.**

---

## Next Steps

- [ ] Run every submission inside an isolated container or sandbox
- [ ] Add execution timeouts
- [ ] Add CPU and memory limits
- [ ] Use unique temporary directories per submission
- [ ] Add stdin and automated test cases
- [ ] Return compilation/runtime errors
- [ ] Unify Redis/PostgreSQL submission state
- [ ] Fix frontend polling and submission ID handling
- [ ] Add submission history
- [ ] Add authentication
- [ ] Add WebSocket or Server-Sent Events for live status updates
- [ ] Support multiple worker instances safely
- [ ] Add automated tests and CI

---

## Why I Built This

I built CraftCode mainly to learn backend engineering concepts beyond a basic CRUD application.

Through this project I have been exploring:

- asynchronous job queues
- Redis
- producer-consumer architecture
- worker processes
- process execution
- PostgreSQL and Prisma
- frontend/backend communication
- polling
- problems involved in safely executing untrusted code

The project is still evolving as I learn more about backend systems, infrastructure, and DevOps.

---

## Disclaimer

CraftCode currently executes submitted code directly on the host machine.

**Do not expose the current version to untrusted users or run arbitrary third-party code with it.**

A proper sandboxing layer should be added before any public deployment.

---

## Author

Built by [Sriram Nambiar](https://github.com/Sriram-Nambiar).
