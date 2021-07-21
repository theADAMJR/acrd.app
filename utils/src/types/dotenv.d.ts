declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      API_PORT: string;
      API_ENDPOINT: string;
      WEBSITE_PORT: string;
    }
  }
}
export {};