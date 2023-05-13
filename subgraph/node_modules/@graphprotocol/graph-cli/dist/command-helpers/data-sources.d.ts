import immutable from 'immutable';
import Protocol from '../protocols';
export declare const fromFilePath: (manifestPath: string) => Promise<any>;
export declare const fromManifest: (manifest: immutable.Map<any, any>, protocol: Protocol) => any;
