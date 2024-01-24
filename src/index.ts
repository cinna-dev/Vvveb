import {join} from 'path';
import fs from 'fs';
import {defined} from './utils'

/* /index.php */

const V_VERSION= '0.0.1';
const DIR_ROOT= __dirname
const DIR_CONFIG = join(DIR_ROOT , 'config' );
const DIR_SYSTEM= join( DIR_ROOT, 'system');
const PAGE_CACHE_DIR = 'page-cache';

// include DIR_ROOT . 'env.php';  >>> .env
import './config';
import * as process from "process";

function is_installed() {
    return fs.existsSync(join(DIR_ROOT, 'config', 'db.js' ))
}

const installPathRedirect = '/install/index';

if (! process.env.APP) {
    if (is_installed()) {
        process.env.APP = 'app';
    } else {
        process.env.APP = 'install';

        const request_uri = location.pathname + location.search;

        if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'install') === false) {
            //avoid redirect loop
            die(header("Location: $installPathRedirect"));
        }
    }
} elseif (! is_installed() && (!defined('APP') || APP != 'install')) {
    defined('APP') || define('APP', 'install');

    if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'install') === false) {
        die(header("Location: $installPathRedirect"));
    }
}

let PUBLIC_PATH = '/public/';

let PUBLIC_THEME_PATH = '/public/';

if ( ! defined(PUBLIC_PATH) ) {
    PUBLIC_PATH = join(process.env.V_SUBDIR_INSTALL ?? '', PUBLIC_PATH);
    PUBLIC_THEME_PATH = join(process.env.V_SUBDIR_INSTALL ?? '', PUBLIC_THEME_PATH);
}

// require_once DIR_SYSTEM . 'core/startup.php';
import 'core/startup.php';

if (process.env.PAGE_CACHE) {
    const {PageCache} = await  import('./page-cache.js');
    const pageCache   = PageCache.getInstance();
    const waitSeconds = 10;

    function saveCache(): void {
        const pageCache = PageCache.getInstance();

        if (pageCache.canSaveCache()) {
            $pageCache->startGenerating();
            $pageCache->startCapture();

            System\Core\start();

            return $pageCache->saveCache();
        } else {
            System\Core\start();
        }
    }

    if ($pageCache->canCache()) {
        if ($pageCache->hasCache()) {
            return $pageCache->getCache();
        } else {
            if ($pageCache->isStale()) {
                if ($pageCache->isGenerating()) {
                    return $pageCache->getStale();
                } else {
                    return saveCache();
                }
            } else {
                //if cache is already generating
                //wait 10 seconds for cache generation
                //if it takes longer then give up
                $i = 0;

                while ($pageCache->isGenerating() && $i++ <= $waitSeconds) {
                    sleep(1);

                    if ($pageCache->hasCache()) {
                        return $pageCache->getCache();
                    }
                }

                //if page took longer than 10 seconds
                //check if the generating page is older than 1 minute
                //if cache is older than 1 minute then regenerate
                //if is not older than 1 minute then show maintenance server overloaded page
                if ($i >= $waitSeconds) {
                    if (! $pageCache->isGeneratingStuck()) {
                        define('SITE_ID', 1);

                        return FrontController::notFound(false, __('Server overload!'), 500);
                    }
                }

                return saveCache();
            }
        }
    } else {
        System\Core\start();
    }
} else {
    System\Core\start();
}
