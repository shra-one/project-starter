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
import changed from "gulp-changed";
import config from './gulp.config';


// -----------------------------------------------------------------------------
// varaibles
// -----------------------------------------------------------------------------

const browserSync = bsCreate();
const PRODUCTION = yargs.argv.prod;
console.log(config.dist.css);
const reload = (done) => {
    browserSync.reload();
    done();
};



/*=============================================
=            Copy Tasks            =
=============================================*/

export const copyFont =()=>{
    return src([config.node.fonts+'/**/*', config.src.fontswatch])
        .pipe(plumber({errorHandler:notify.onError("Error: <%= error.message %>") }))
        .pipe(dest(config.dist.fonts))

}

export const copyData=()=>{
    return src(config.src.datawatch)
        .pipe(plumber({errorHandler:notify.onError("Error: <%= error.message %>") }))
        .pipe(dest(config.dist.data))

}



export const copyNodeJs=()=>{
    return src(config.node.js)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))

    .pipe(gulpIf(!PRODUCTION, sourcMap.init()))
    .pipe(concat('vendor.js'))
    .pipe(size({ showFiles: true }))
    .pipe(gulpIf(!PRODUCTION, sourcMap.write()))
    .pipe(gulpIf(PRODUCTION, uglify()))
    .pipe(dest(config.dist.js))
    .pipe(size({ showFiles: true }))
    .pipe(notify({ message: `vendor js files successfully compiled.`, onLast: true }))
}




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
        .pipe(browserSync.stream());
}


// -----------------------------------------------------------------------------
// Javascript Task :: combine node plugins js and custom js/ Compile/Minified
// -----------------------------------------------------------------------------

export const script = () => {
    return src(config.src.js)
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
    // Resize all JPG images to three different sizes: 200, 500, and 630 pixels
    '**/*.jpg': [
        {
            width: 50,
            blur: 20,
            rename: { suffix: '-blur' }
        },
        {
            width: 375,
            rename: { suffix: '-xs' }
        },
        {
            width: 576,
            rename: { suffix: '-sm' }
        },
        {
            width: 768,
            rename: { suffix: '-md' }
        },
        {
            width: 992,
            rename: { suffix: '-lg' }
        },
        {
            width: 1200,
            rename: { suffix: '-xl' }
        },
        {
            width: 1920,
            rename: { suffix: '-fhd' }
        }
    ],
    // Resize all PNG images to be retina ready
    '**/*.png': [
        {
            width: 50,
            blur: 20,
            rename: { suffix: '-blur' }
        },
        {
            width: 375,
            rename: { suffix: '-xs' }
        },
        {
            width: 576,
            rename: { suffix: '-sm' }
        },
        {
            width: 768,
            rename: { suffix: '-md' }
        },
        {
            width: 992,
            rename: { suffix: '-lg' }
        },
        {
            width: 1200,
            rename: { suffix: '-xl' }
        },
        {
            width: 1920,
            rename: { suffix: '-fhd' }
        }
    ],
    '*.svg': [{}]
};


// export const imagesCopy = () => {
//     return src([config.src.imgwatch, `!${config.src.img}responsive/**/*`])
//         .pipe(newer(config.dist.img))
//         .pipe(gulpIf(PRODUCTION, imagemin(imageminConfig)))
//         .pipe(dest(config.dist.img))
// }

export const images = (done) => {
    return src(config.src.imgwatch + '.{png,jpg}')
        .pipe(changed(config.temp.img + 'cached/'))
        .pipe(dest(config.temp.img + 'cached/'))
        .pipe(responsive(imageResizeConfig, {
            // Global configuration for all images
            // The output quality for JPEG, WebP and TIFF output formats
            quality: 70,
            // Use progressive (interlace) scan for JPEG and PNG output
            progressive: true,
            // Strip all metadata
            withMetadata: false,
            withoutEnlargement: true,
            errorOnUnusedConfig: false,
            errorOnEnlargement: false,
            errorOnUnusedImage: false,
            silent: true
        }))
        .pipe(gulpIf(PRODUCTION, imagemin(imageminConfig)))
        .pipe(dest(config.dist.img))
    done();
}



// -----------------------------------------------------------------------------
// BrowserSync and Watch Task  :: live refresh/ port url browsing auto
// -----------------------------------------------------------------------------
export const serve = (done) => {
    browserSync.init({
        server: {
            baseDir: config.dist.root
        },
        browser: "chrome",
        port: 3010
    });

    watch(config.src.scsswatch, style)
    watch(config.src.jswatch, series(script, reload));
    watch(config.src.imgwatch, series(images, reload));
    watch(config.src.htmlwatch, series(nunjucks, reload));
    watch(config.src.datawatch, series(nunjucks, reload));
    done();
}


// -----------------------------------------------------------------------------
// Delete Task  :: Delete folders 
// -----------------------------------------------------------------------------
export const clean = () => del([config.dist.root]);

// -----------------------------------------------------------------------------
// Sitemap Task  :: 
// -----------------------------------------------------------------------------




/*=============================================
=            Build all            =
=============================================*/

const dev = series(clean, copyFont, copyData, style, script, nunjucks, images,  serve);

export default dev;


