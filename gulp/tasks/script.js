import { src, dest } from "gulp";
import plumber from "gulp-plumber";
import sourcMap from "gulp-sourcemaps";
import concat from 'gulp-concat';
import babel from 'gulp-babel';
import gulpIf from 'gulp-if';
import size from 'gulp-size';
import notify from 'gulp-notify';
import yargs from 'yargs';
import uglify from 'gulp-uglify';
import config from '../config';

const PRODUCTION = yargs.argv.prod;

const script = () => {
    const s = size();
    return src(config.src.jswatch)
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))

        .pipe(gulpIf(!PRODUCTION, sourcMap.init()))
        .pipe(concat('app.js'))
        .pipe(babel())
        .pipe(size({ showFiles: true }))
        .pipe(gulpIf(!PRODUCTION, sourcMap.write()))
        .pipe(gulpIf(PRODUCTION, uglify()))
        .pipe(dest(config.dist.js))
        .pipe(size({ showFiles: true }))
        .pipe(notify({ message: `js files successfully compiled.`, onLast: true }))
}

export default script;