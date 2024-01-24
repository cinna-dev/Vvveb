import {close, promises, existsSync} from 'node:fs';
import tmp from 'tmp';

export const defined = (val: unknown) => typeof val !== "undefined"

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