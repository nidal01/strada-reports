const DEFAULT_DEMO_PROVISION_API_URL = "https://staging.strada.tr";

export const DEFAULT_DEMO_APP_LOGIN_URL = `${DEFAULT_DEMO_PROVISION_API_URL}/login`;

export type DemoProvisionConfig = {
  apiUrl: string;
  apiKey: string;
  appLoginUrl: string;
};

/** Server-only demo provisioning settings for the marketing site API route. */
export function getDemoProvisionConfig(): DemoProvisionConfig {
  const apiUrl = (
    process.env.DEMO_PROVISION_API_URL ?? DEFAULT_DEMO_PROVISION_API_URL
  ).replace(/\/$/, "");

  const apiKey = process.env.DEMO_PROVISION_API_KEY?.trim() ?? "";

  const appLoginUrl = (
    process.env.DEMO_APP_LOGIN_URL ?? DEFAULT_DEMO_APP_LOGIN_URL
  ).replace(/\/$/, "");

  return { apiUrl, apiKey, appLoginUrl };
}

export function isDemoProvisionConfigured(config: DemoProvisionConfig): boolean {
  return config.apiKey.length > 0;
}
