const DEFAULT_DEMO_PROVISION_API_URL = "https://staging.strada.tr";

export const DEFAULT_DEMO_APP_LOGIN_URL = `${DEFAULT_DEMO_PROVISION_API_URL}/login`;

export type DemoProvisionConfig = {
  apiUrl: string;
  apiKey: string;
  appLoginUrl: string;
};

function resolveDemoProvisionApiUrl(): string {
  const configured = process.env.DEMO_PROVISION_API_URL?.trim().replace(/\/$/, "");

  // Local/dev can override (e.g. http://127.0.0.1:8000)
  if (process.env.NODE_ENV === "development" && configured) {
    return configured;
  }

  // Production marketing site always provisions demos on staging entegre
  if (process.env.VERCEL_ENV === "production" || process.env.VERCEL === "1") {
    return DEFAULT_DEMO_PROVISION_API_URL;
  }

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
