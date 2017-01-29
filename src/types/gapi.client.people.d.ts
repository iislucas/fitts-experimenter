/// <reference types="gapi" />

declare namespace gapi.client.people.people {
  interface Result {
    result: {
      names: { givenName:string }[];
      error: {
        message: string;
      }
    }
  }
  export function get(params:{ resourceName: string;}) : Promise<Result>;
}
