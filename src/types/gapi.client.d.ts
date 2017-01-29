/// <reference types="gapi" />

declare namespace gapi.client {
  export interface InitConfig {
    discoveryDocs:string[];
    clientId:string;
    scope: string;
    apiKey?:string;
  }
  export function init(config:InitConfig) : Promise<void>;
}
