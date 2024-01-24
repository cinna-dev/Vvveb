import { join } from 'path';
import { isWritable, mkdir, isDir, sysGetTempDir } from '../../utils';
import * as process from "process";
let storage_dir = join(__dirname, '..', '..', 'storage');

( async () => {
    try {
        await isWritable(storage_dir);
        process.env.DIR_STORAGE = storage_dir;
    } catch (err) {
        storage_dir = join(sysGetTempDir(), 'storage');

        if (! isDir(storage_dir)) {
            await mkdir(storage_dir);
            await mkdir(join(storage_dir, 'compiled-templates'));
            await mkdir(join(storage_dir, 'cache'));
            await mkdir(join(storage_dir, 'model'));
            await mkdir(join(storage_dir, 'model', 'admin' ));
            await mkdir(join(storage_dir, 'model/app'));
            await mkdir(join(storage_dir, 'model/install'));
        }

        process.env.DIR_STORAGE = storage_dir;
    }
})();

process.env.DIR_CACHE = join(process.env.DIR_ROOT ?? '' ,'storage', 'cache');
process.env.DIR_PLUGINS = join(process.env.DIR_ROOT ?? '' , 'plugins');
process.env.DIR_COMPILED_TEMPLATES = join( process.env.DIR_STORAGE ?? '' , 'compiled-templates');
process.env.DIR_BACKUP = join(process.env.DIR_STORAGE ?? '', 'backup');
process.env.DIR_THEMES = join( process.env.DIR_ROOT ?? '' , 'public', 'themes');

if (process.env.APP === 'app') {
    process.env.DIR_THEME= join(process.env.DIR_ROOT ?? '' , 'public', 'themes');
} else {
    process.env.DIR_THEME= join(process.env.DIR_ROOT ?? '' , 'public', process.env.App ?? '');
}

process.env.DIR_PUBLIC = join( process.env.DIR_ROOT ?? '' , 'public');


process.env.DIR_APP = join( process.env.DIR_ROOT ?? '' , process.env.APP ?? '');
process.env.DIR_TEMPLATE = join( process.env.DIR_APP ?? '' , 'template');
process.env.DIR_MEDIA = join( process.env.DIR_PUBLIC ?? '' , 'media' );
process.env.CDATA_START = '<![CDATA[';
process.env.CDATA_END = ']]>';

const error_log = ini_get('error_log');
