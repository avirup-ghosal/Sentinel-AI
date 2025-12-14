export interface GitleaksReport {
  findings?: unknown[];
}

export function parseGitleaks(report: GitleaksReport) {
  return {
    secrets: report?.findings?.length ?? 0,
  };
}

