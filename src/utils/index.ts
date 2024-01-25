import {close, promises, existsSync, PathLike} from 'node:fs';
import tmp from 'tmp';
import fs, {FileHandle} from 'fs/promises';

export const defined = (val: unknown) => typeof val !== "undefined"

export const isSet = (val: unknown) => typeof val !== 'undefined' && val !== null;

/**
 *
 * @throws {Error}
 */
export const isWritable = async (filename: string) => {
    let fd = 0;
    try {
        const fileHandle  =   await promises.open(filename, 'wx' );
        fd = fileHandle.fd;
    } catch (error) {
        throw error;
    } finally {
        close(fd, (err) => {
            if (err) throw err;
        });
    }
}

type MkdirParams = Parameters<typeof promises.mkdir>

export const mkdir = async (directory: string, options?: MkdirParams[1] ) => {
    try {
        await promises.mkdir(directory, options);
    } catch (error) {
        throw error;
    }
}

export const isDir = (filename: string): boolean => existsSync(filename);

export const sysGetTempDir = (): string => {
    let dirPath = '';
    tmp.dir((err, path, cleanupCallback) => {
        if (err) throw err;
        dirPath = path
        console.log('Dir: ', path);
        // Manual cleanup
        cleanupCallback();
    });
    return dirPath
}

export const iniGet = (option: string): string | false => '' // no implementation

export const iniSet = (option: string, value: string): string | false => '' // no implementation

export const logError = (message: string) => {
    console.error(message);
    return true;
}

export const fileGetContents = async (
    filename: PathLike | FileHandle,
    useIncludePath = false,
    context?: string,
    offset = 0,
    length?: number
) => {
    try {
        return await fs.readFile(filename, {encoding: 'utf-8'});
    } catch (error) {
        console.error(error);
        return false;
    }
}