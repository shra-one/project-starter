import { src, dest } from "gulp";
import plumber from "gulp-plumber";
import notify from 'gulp-notify';
import yargs from 'yargs';
import changed from "gulp-changed";
import responsive from "gulp-responsive";
import gulpIf from 'gulp-if';
import imagemin from 'gulp-imagemin';
import config from '../config';
 

const PRODUCTION = yargs.argv.prod;

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

export default function images(done) {
    return src(config.src.imgwatch)
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
