export type TrivySeverity =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "UNKNOWN";

export interface TrivyVulnerability {
  VulnerabilityID: string;
  Severity: TrivySeverity;
  PkgName?: string;
  InstalledVersion?: string;
  FixedVersion?: string;
}

export interface TrivyResultItem {
  Target: string;
  Type: string;
  Vulnerabilities?: TrivyVulnerability[];
}

export interface TrivyResult {
  Results?: TrivyResultItem[];
}

/**
 * Optional helper if you want to reuse later
 */
export function parseTrivy(trivy: TrivyResult) {
  const counts: Record<TrivySeverity, number> = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    UNKNOWN: 0,
  };

  for (const result of trivy.Results ?? []) {
    for (const vuln of result.Vulnerabilities ?? []) {
      counts[vuln.Severity]++;
    }
  }

  return counts;
}
