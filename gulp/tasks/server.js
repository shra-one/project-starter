import { watch, series } from "gulp";
import { create as bsCreate, stream as bsStream, init as bsInit } from 'browser-sync';
import { script } from "./script";
import { images } from "./images";
import { nunjucks } from "./nunjucks";
import { style } from "./style";
import config from '../config';
 
const browserSync = bsCreate();
export function reload(done) {
    server.reload();
    done();
  }
// const browserSync = bsCreate();
// const reload = () => {
//     browserSync.reload();
  
// };
 
export const serve = (done) => {
    browserSync.init({
        server: {
            baseDir: config.dist.root
        },
        browser: "chrome",
        port: 3010
    });
    watch(config.src.scsswatch, style);
    // watch(config.src.scsswatch, ["style"])
    // watch(config.src.jswatch, series(script, reload));
    // watch(config.src.imgwatch, series(images, reload));
    // watch(config.src.htmlwatch, series(nunjucks, reload));
    // watch(config.src.datawatch, series(nunjucks, reload));
    done();
}
 