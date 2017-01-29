/// <reference types="gapi" />

declare namespace gapi.client.drive {
  interface ErrorResource {
    message:string;
    code:number;
    errors: {
      domain: string;
      message: string;
      reason: string;
    }
  }
  interface PermissionsResource {}
  interface FileResource
    {
      "kind": "drive#file",
      "id": string,
      "name": string,
      "mimeType": string,
      "description": string,
      "starred": boolean,
      "trashed": boolean,
      "explicitlyTrashed": boolean,
      "parents": string[],
      "properties": { [key:string]: string },
      "appProperties": { [key:string]: string },
      "spaces": string[],
      "version": number,
      "webContentLink": string,
      "webViewLink": string,
      "iconLink": string,
      "hasThumbnail": boolean,
      "thumbnailLink": string,
      "thumbnailVersion": number,
      "viewedByMe": boolean,
      "viewedByMeTime": Date,
      "createdTime": Date,
      "modifiedTime": Date,
      "modifiedByMeTime": Date,
      "modifiedByMe": boolean,
      "sharedWithMeTime": Date,
      "sharingUser": {
        "kind": "drive#user",
        "displayName": string,
        "photoLink": string,
        "me": boolean,
        "permissionId": string,
        "emailAddress": string
      },
      "owners": [
        {
          "kind": "drive#user",
          "displayName": string,
          "photoLink": string,
          "me": boolean,
          "permissionId": string,
          "emailAddress": string
        }
      ],
      "lastModifyingUser": {
        "kind": "drive#user",
        "displayName": string,
        "photoLink": string,
        "me": boolean,
        "permissionId": string,
        "emailAddress": string
      },
      "shared": boolean,
      "ownedByMe": boolean,
      "capabilities": {
        "canEdit": boolean,
        "canComment": boolean,
        "canShare": boolean,
        "canCopy": boolean,
        "canReadRevisions": boolean
      },
      "viewersCanCopyContent": boolean,
      "writersCanShare": boolean,
      "permissions": PermissionsResource[],
      "folderColorRgb": string,
      "originalFilename": string,
      "fullFileExtension": string,
      "fileExtension": string,
      "md5Checksum": string,
      "size": number,
      "quotaBytesUsed": number,
      "headRevisionId": string,
      "contentHints": {
        "thumbnail": {
          "image": string, // URL-safe Base64; RFC 4648 section 5
          "mimeType": string
        },
        "indexableText": string
      },
      "imageMediaMetadata": {
        "width": number,
        "height": number,
        "rotation": number,
        "location": {
          "latitude": number,
          "longitude": number,
          "altitude": number
        },
        "time": string,
        "cameraMake": string,
        "cameraModel": string,
        "exposureTime": number,
        "aperture": number,
        "flashUsed": boolean,
        "focalLength": number,
        "isoSpeed": number,
        "meteringMode": string,
        "sensor": string,
        "exposureMode": string,
        "colorSpace": string,
        "whiteBalance": string,
        "exposureBias": number,
        "maxApertureValue": number,
        "subjectDistance": number,
        "lens": string
      },
      "videoMediaMetadata": {
        "width": number,
        "height": number,
        "durationMillis": number
      },
      "isAppAuthorized": boolean
    }

  interface CreateRequest {
    resource: {
      name : string,
      mimeType : string;
    },
    fields: string;
  }
  interface Result<T> {
    result: T & {
      error: ErrorResource
    };
    headers: { [header:string]:string };
    status: number;
    statusText: string;
  }

  interface CreateResult {
    result: FileResource & {
      error: ErrorResource
    };
    headers: { [header:string]:string };
    status: number;
    statusText: string;
  }

  interface ListRequest {
    q: string;
  }
  interface ListResource {
    kind: "drive#fileList",
    nextPageToken: string,
    files: FileResource[]
  }

  export let about:any;
  export namespace files {
    // export function copy(x:any):void;
    export function create(createRequest:CreateRequest):
        Promise<Result<FileResource>>;
    // export function delete()
    // export function emptyTrash()
    // export function export()
    // export function generateIds()
    // export function get()
    export function list(listRequest:ListRequest) :
        Promise<Result<ListResource>>;
    // export function update()
    // export function watch()
  }
  export let changes:any;
  export let channels:any;
  export let comments:any;
  export let permissions:any;
  export let replies:any;
  export let revisions:any;
}
