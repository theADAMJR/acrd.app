declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      PORT: string;
    }
  }
}
export {};