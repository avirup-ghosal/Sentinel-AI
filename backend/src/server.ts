import Fastify from "fastify";
import cors from "@fastify/cors";
import { v4 as uuidv4 } from "uuid";
import { simpleGit } from "simple-git";
import { triggerScanFlow } from "./kestra.js";


const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
});

const git = simpleGit();

app.get("/health", async () => {
  return { status: "ok" };
});

app.post("/analyze", async (request, reply) => {
  const { repoUrl } = request.body as { repoUrl?: string };

  if (!repoUrl || !repoUrl.startsWith("https://github.com/")) {
    return reply.status(400).send({ error: "Invalid GitHub repo URL" });
  }

  const jobId = uuidv4();

  // Trigger Kestra ONLY
  const execution = await triggerScanFlow(repoUrl, jobId);

  return {
    jobId,
    status: "SCANNING",
    kestraExecutionId: execution.id,
  };
});


app.listen({ port: 4000, host: "0.0.0.0" });
