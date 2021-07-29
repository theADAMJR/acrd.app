declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      API_PORT: string;
      API_PREFIX: string;
      JWT_SECRET_KEY: string;
      MONGO_URI: string;
      WEBSITE_PORT: string;
    }
  }
}
export {};