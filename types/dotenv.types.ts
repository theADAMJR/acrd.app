declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      EMAIL_ADDRESS: string;
      EMAIL_PASSWORD: string;
      MONGO_URI: string;
      NODE_ENV: 'dev' | 'prod';
      PORT: string;
      ROOT_ENDPOINT: string;
      WEBSITE_URL: string;
    }
  }
}
export {};