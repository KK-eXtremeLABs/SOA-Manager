export interface Environment {
  production: boolean;
  adminUrl: string;
  baseUrl: string;
  google: {
    apiKey: string;
  };
  eptEnabled: boolean;
  whiteKey: string;
  blueKey: string;
}
