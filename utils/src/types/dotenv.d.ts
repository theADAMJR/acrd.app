declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      API_PORT: string;
      API_PREFIX: string;
      WEBSITE_PORT: string;
    }
  }
}
export {};