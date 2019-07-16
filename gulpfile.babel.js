'use strict';

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

import { src, dest, watch, series, parallel } from 'gulp';
import { create as bsCreate, stream as bsStream, init as bsInit } from 'browser-sync';
import yargs from 'yargs';
import sass from 'gulp-sass';
import gulpIf from 'gulp-if';
import cssNano from 'cssnano';
import postCss from 'gulp-postcss';
import autoPrefixer from 'autoprefixer';
import concat from 'gulp-concat';
import replace from 'gulp-replace';
import sourcMap from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import del from 'del';
import size from 'gulp-size';
import newer from 'gulp-newer';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import babel from 'gulp-babel';
import nunjucksRender from "gulp-nunjucks-render";
import { readJson } from "fs-extra";
import data from "gulp-data";
import responsive from "gulp-responsive";
import config from './gulp.config';


// -----------------------------------------------------------------------------
// varaibles
// -----------------------------------------------------------------------------

const browserSync = bsCreate();
const PRODUCTION = yargs.argv.prod;
console.log(config.dist.css);



// -----------------------------------------------------------------------------
// Sass Task :: combine node plugins css and custom css / Compile/ Minify
// -----------------------------------------------------------------------------

const cssConfig = {
    sassOpts: {
        sourceMap: !PRODUCTION,
        // imagePath:'/images',
        // includePaths: config.node.css,
        outputStyle: PRODUCTION ? "\'compressed\'" : "\'expanded\'",
        // outputStyle:'expanded',
        precision: 3,
        errLogToConsole: true
    }
}


export const style = () => {
    return src(config.src.scsswatch)
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
        .pipe(gulpIf(!PRODUCTION, sourcMap.init()))
        .pipe(sass(cssConfig).on('error', sass.logError))
        .pipe(postCss([autoPrefixer()]))
        .pipe(gulpIf(PRODUCTION, postCss([cssNano])))
        .pipe(gulpIf(!PRODUCTION, sourcMap.write()))
        .pipe(size({ showFiles: true }))
        .pipe(dest(config.dist.css))
        .pipe(notify({ message: `Sass files successfully compiled.`, onLast: true }))
        .pipe(bsStream());
}


// -----------------------------------------------------------------------------
// Javascript Task :: combine node plugins js and custom js/ Compile/Minified
// -----------------------------------------------------------------------------

export const script = () => {
    const s = size();
    return src(config.node.js)
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))

        .pipe(gulpIf(!PRODUCTION, sourcMap.init()))
        .pipe(babel())
        .pipe(concat('app.js'))
        .pipe(size({ showFiles: true }))
        .pipe(gulpIf(!PRODUCTION, sourcMap.write()))
        .pipe(gulpIf(PRODUCTION, uglify()))
        .pipe(dest(config.dist.js))
        .pipe(size({ showFiles: true }))
        .pipe(notify({ message: `js files successfully compiled.`, onLast: true }))
}

// -----------------------------------------------------------------------------
// Nunjucks Html Task :: HTML/Templating/Macro/
// -----------------------------------------------------------------------------

const nunjucksConfig = {
    path: config.src.html,
    data: {
        css_url: './assets/css/',
        img_url: './assets/images/'
    }

}

export const nunjucks = () => {
    return src(config.src.html + '*.*')
        .pipe(data(() => readJson(config.src.data + 'content.json')))
        // .pipe(data(function() {
        //     return JSON.parse(readFileSync('./src/data/*.json'))
        //     // return require('./src/data/package.json')
        //     // return  readJson('./src/data/*.json') 
        //   }))
        .pipe(nunjucksRender(nunjucksConfig))
        .pipe(dest(config.dist.root));

}



// -----------------------------------------------------------------------------
// Image Task  :: copy and minified
// -----------------------------------------------------------------------------

const imageminConfig = [
    imagemin.gifsicle({ interlaced: true }),
    imagemin.jpegtran({ progressive: true }),
    imagemin.optipng({ optimizationLevel: 5 }),
    imagemin.svgo({
        plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
        ]
    })
]

const imageResizeConfig = {
    '*.jpg': [
        {
            // image-medium.jpg is 375 pixels wide
            width: 10,
            blur:15,
            rename: {
                suffix: '-tiny',
                
            },
        }, 
        {
            // image-medium.jpg is 375 pixels wide
            width: 375,
            rename: {
                suffix: '-medium',
                
            },
        }, 
        {
            // image-large.jpg is 480 pixels wide
            width: 480,
            rename: {
                suffix: '-large',
                
            },
        },
        {
            // image-extralarge.jpg is 768 pixels wide
            width: 768,
            rename: {
                suffix: '-extralarge',
                
            },
        
        },
        {
            // image-extralarge.jpg is 768 pixels wide
            width: 'auto',
         
        }
    ]
}

export const images = () => {
    return src(config.src.imgwatch)
        .pipe(newer(config.dist.img))
        .pipe(gulpIf(PRODUCTION, imagemin(imageminConfig)))
        .pipe(dest(config.dist.img))
}




// -----------------------------------------------------------------------------
// BrowserSync and Watch Task  :: live refresh/ port url browsing auto
// -----------------------------------------------------------------------------



// -----------------------------------------------------------------------------
// Delete Task  :: Delete folders 
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Sitemap Task  :: 
// -----------------------------------------------------------------------------