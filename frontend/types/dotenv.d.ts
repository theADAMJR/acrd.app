declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      PORT: number;
      REACT_APP_API_URL: string;
      REACT_APP_CDN_URL: string;
      REACT_APP_REPO: string;
      REACT_APP_ROOT_API_URL: string;
    }
  }
}
export {};

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}