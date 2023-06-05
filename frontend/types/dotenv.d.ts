declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      PORT: number;
      REACT_APP_API_URL: string;
      REACT_APP_CDN_URL: string;
      REACT_APP_WEBSITE_URL: string;
      REACT_APP_REPO_URL: string;
      REACT_APP_VERSION_NAME: string;
      REACT_APP_VERSION_NUMBER: string;
      REACT_APP_ROOT_API_URL: string;
      REACT_APP_OWNER_USER_ID: string;
      REACT_APP_RECAPTCHA_SITE_KEY: string;
    }
  }
}
export { };