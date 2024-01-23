import * as process from "process";
import path from 'node:path';

global.appRoot = path.resolve(__dirname)

if (process.env.DEBUG) {
    process.env.DISPLAY_ERRORS = '1';
    process.env.DISPLAY_STARTUP_ERRORS = '1';
    // error_reporting(E_ALL); // display all errors
}
