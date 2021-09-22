export interface ResourceReference {
    ItemId  : string;
    ItemType: string;
}

export interface FileResourceMetadata {
    ResourceId?       : string;
    VersionIdentifier?: string;
    FileName?         : string;
    OriginalName?     : string;
    SourceFilePath?   : string;
    MimeType?         : string;
    Size?             : number;
    StorageKey?       : string;
}
