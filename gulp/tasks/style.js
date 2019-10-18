import { src, dest } from "gulp";
import plumber from "gulp-plumber";
import sourcMap from "gulp-sourcemaps";
import postCss from "gulp-postcss";
import sass from "gulp-sass";
import cssNano from 'cssnano';
import autoPrefixer from 'autoprefixer';
import yargs from 'yargs';
import gulpIf from 'gulp-if';
import size from 'gulp-size';
import notify from 'gulp-notify';
import { create as bsCreate, stream as bsStream, init as bsInit } from 'browser-sync';
import {reload} from './server'
import config from '../config';

const browserSync = bsCreate();
const PRODUCTION = yargs.argv.prod;
const sassOpts= {
        sourceMap: !PRODUCTION,
        // imagePath:'/images',
        includePaths: config.node.css,
        outputStyle: PRODUCTION ? "\'compressed\'" : "\'expanded\'",
        // outputStyle:'expanded',
        precision: 3,
        errLogToConsole: true
    
}


export const style = () => {
    return src(config.src.scsswatch)
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
        .pipe(gulpIf(!PRODUCTION, sourcMap.init()))
        .pipe(sass(sassOpts).on('error', sass.logError))
        .pipe(postCss([autoPrefixer()]))
        .pipe(gulpIf(PRODUCTION, postCss([cssNano])))
        .pipe(gulpIf(!PRODUCTION, sourcMap.write()))
        .pipe(size({ showFiles: true }))
        .pipe(dest(config.dist.css))
        .pipe(notify({ message: `Sass files successfully compiled.`, onLast: true }))
        .pipe(browserSync.stream());
}

