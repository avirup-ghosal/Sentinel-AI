// src/server.ts
// app.post("/scan", async (req, reply) => {
//   const { repoUrl } = req.body as { repoUrl?: string };

//   if (!repoUrl) {
//     return reply.code(400).send({ error: "repoUrl is required" });
//   }

//   const execution = await triggerScan(repoUrl);

//   return reply.send({
//     message: "Scan triggered successfully",
//     executionId: execution.id,
//     state: execution.state?.current ?? "UNKNOWN",
//   });
// });
// src/server.ts
import Fastify from "fastify";
import { triggerScan, fetchArtifact } from "./kestra.js";
import {
  type TrivyResult,
  type TrivySeverity,
} from "./parsers/trivy.js";
import { saveScan, getScan } from "./store.js";

const app = Fastify({ logger: true });

app.post("/scan", async (req, reply) => {
  const { repoUrl } = req.body as { repoUrl?: string };
  if (!repoUrl) {
    return reply.code(400).send({ error: "repoUrl is required" });
  }

  const execution = await triggerScan(repoUrl);

  // Background processing (do NOT await)
  processScanResults(execution.id, repoUrl).catch(console.error);

  return reply.send({
    message: "Scan triggered",
    executionId: execution.id,
    state: execution.state?.current ?? "UNKNOWN",
  });
});

async function processScanResults(
  executionId: string,
  repoUrl: string
) {
  const trivy = (await fetchArtifact(
    executionId,
    "trivy.json"
  )) as TrivyResult;

  const gitleaks = await fetchArtifact(
    executionId,
    "gitleaks.json"
  );

  const vulnerabilities: Record<TrivySeverity, number> = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    UNKNOWN: 0,
  };

  for (const result of trivy.Results ?? []) {
    for (const vuln of result.Vulnerabilities ?? []) {
      vulnerabilities[vuln.Severity]++;
    }
  }

  const secrets = gitleaks?.Leaks?.length ?? 0;

  saveScan(executionId, {
    executionId,
    repoUrl,
    createdAt: new Date().toISOString(),
    summary: {
      vulnerabilities,
      secrets,
    },
    trivy,
    gitleaks,
  });
}

app.get("/scan/:id", async (req, reply) => {
  const { id } = req.params as { id: string };
  const scan = getScan(id);

  if (!scan) {
    return reply.code(404).send({ error: "Scan not found" });
  }

  return scan;
});

app.listen({ port: 4000, host: "0.0.0.0" });
