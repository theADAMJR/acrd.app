declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      API_PORT: string;
      API_PREFIX: string;
      MONGO_URI: string;
      WEBSITE_PORT: string;
    }
  }
}
export {};