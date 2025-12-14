import axios from "axios";

const KESTRA_BASE_URL = process.env.KESTRA_URL || "http://localhost:8080";

export async function triggerScanFlow(repoUrl: string, jobId: string) {
  const response = await axios.post(
    `${KESTRA_BASE_URL}/api/v1/executions/secureopsai/scan-repo`,
    {
      inputs: {
        repoUrl,
        jobId,
      },
    }
  );

  return response.data;
}

export async function getExecution(
  executionId: string
) {
  const res = await axios.get(
    `${KESTRA_BASE_URL}/api/v1/executions/${executionId}`
  );

  return res.data;
}
