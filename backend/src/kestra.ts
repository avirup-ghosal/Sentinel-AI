// src/kestra.ts
import axios from "axios";

const AUTH = {
  username: "admin@kestra.io",
  password: "Admin1234",
};

import FormData from "form-data";

const KESTRA_URL =
  "http://localhost:8080/api/v1/executions/devsecops/scan-repo?wait=true";

export async function triggerScan(repoUrl: string) {
  const form = new FormData();
  form.append("repoUrl", repoUrl);

  const res = await axios.post(KESTRA_URL, form, {
    auth: {
      username: "admin@kestra.io",
      password: "Admin1234",
    },
    headers: {
      ...form.getHeaders(), //
    },
  });

  return res.data;
}
export async function waitForCompletion(executionId: string) {
  while (true) {
    const res = await axios.get(
      `$http://localhost:8080/api/v1/executions/${executionId}`,
      { auth: AUTH }
    );

    const state = res.data.state.current;
    if (state === "SUCCESS") return res.data;
    if (state === "FAILED") throw new Error("Scan failed");

    await new Promise(r => setTimeout(r, 3000));
  }
}

export async function fetchArtifact(
  executionId: string,
  file: string
): Promise<any> {
  const res = await axios.get(
    `http://localhost:8080/api/v1/executions/${executionId}/files/${file}`,
    {
      auth: AUTH,
      responseType: "arraybuffer", // 🔥 REQUIRED
    }
  );

  // Convert buffer → string → JSON
  const json = JSON.parse(res.data.toString("utf-8"));
  return json;
}