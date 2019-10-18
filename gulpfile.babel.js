import {series, parallel} from 'gulp'
import copyAll from './gulp/tasks/copy'
import {style} from './gulp/tasks/style'
import script from './gulp/tasks/script'
import nunjucks from './gulp/tasks/nunjucks'
import images from './gulp/tasks/images'
import {serve} from './gulp/tasks/server'
import {watch} from './gulp/tasks/watch'
 
exports.copy = copyAll;
exports.style = style;
exports.script = script;
exports.nunjucks = nunjucks;
exports.images = images;
exports.serve  = serve ;
exports.watch  = watch ;
// const dev = series(copyAll, style, script, nunjucks, images,  serve);
// export default dev;
exports.default= series(copyAll, style, script, nunjucks, images, serve)
exports.default= series(copyAll, parallel(style, script, nunjucks, images), serve)
// exports.watch  = series(style, watch) ;
 
 