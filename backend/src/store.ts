export interface ScanRecord {
  executionId: string;
  repoUrl: string;
  createdAt: string;
  summary: {
    vulnerabilities: {
      CRITICAL: number;
      HIGH: number;
      MEDIUM: number;
      LOW?: number;
      UNKNOWN?: number;
    };
    secrets: number;
  };
  trivy: any;
  gitleaks: any;
}

const scans = new Map<string, ScanRecord>();

export function saveScan(executionId: string, data: ScanRecord) {
  scans.set(executionId, data);
}

export function getScan(executionId: string) {
  return scans.get(executionId);
}
