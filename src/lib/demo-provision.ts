const DEFAULT_DEMO_PROVISION_API_URL = "https://app.strada.tr";

export const DEFAULT_DEMO_APP_LOGIN_URL = `${DEFAULT_DEMO_PROVISION_API_URL}/login`;

export type DemoProvisionConfig = {
  apiUrl: string;
  apiKey: string;
  appLoginUrl: string;
};

function resolveDemoProvisionApiUrl(): string {
  const configured = process.env.DEMO_PROVISION_API_URL?.trim().replace(/\/$/, "");

  // Prefer explicit env (Vercel / local). Falls back to production app.
  return configured || DEFAULT_DEMO_PROVISION_API_URL;
}

/** Server-only demo provisioning settings for the marketing site API route. */
export function getDemoProvisionConfig(): DemoProvisionConfig {
  const apiUrl = resolveDemoProvisionApiUrl();
  const apiKey = process.env.DEMO_PROVISION_API_KEY?.trim() ?? "";

  const appLoginUrl = (
    process.env.DEMO_APP_LOGIN_URL ?? `${apiUrl}/login`
  ).replace(/\/$/, "");

  return { apiUrl, apiKey, appLoginUrl };
}

export function isDemoProvisionConfigured(config: DemoProvisionConfig): boolean {
  return config.apiKey.length > 0;
}
