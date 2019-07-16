'use strict';

// -----------------------------------------------------------------------------
// Development or production
// -----------------------------------------------------------------------------
// var   tap                                     =   require('gulp-tap');
const devBuild  = ((process.env.NODE_ENV || 'development').trim().toLowerCase() === 'development');

console.log('Gulp', devBuild ? 'development' : 'production', 'build');
console.log(process.env.NODE_ENV);
// change environment to production : $env:NODE_ENV="production" and try gulp to build for  for production
// or change environment to development : $env:NODE_ENV="development" and try gulp to build for development

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

const   {src, dest, watch, series, parallel }   =   require('gulp');
const   sass                                    =   require('gulp-sass');
const   autoprefixer                            =   require('autoprefixer');
const   cssnano                                 =   require('cssnano')
const   concat                                  =   require('gulp-concat');
const   postcss                                 =   require('gulp-postcss');
const   noop                                    =   require('gulp-noop');
const   replace                                 =   require('gulp-replace');
const   sourcemaps                              =   devBuild ?require('gulp-sourcemaps'): null;
const   uglify                                  =   require('gulp-uglify');
const   config                                  =   require('./gulp.config');
const   browsersync                             =   devBuild ? require('browser-sync').create() : null;
const   del                                     =   require('del');
const   imagemin                                =   require('gulp-imagemin');
const   size                                    =   require('gulp-size');
const   newer                                   =   require('gulp-newer');
 
 

// -----------------------------------------------------------------------------
// Sass compilation
// -----------------------------------------------------------------------------

const cssConfig ={
    sassOpts: {
        sourceMap: devBuild,
        // imagePath:'/images',
        // includePaths: config.node.css,
        outputStyle:devBuild?"\'expanded\'":"\'compressed\'",
        // outputStyle:'expanded',
        precision       : 3,
        errLogToConsole : true
    }
}

function styleTask() {  
    return src(config.src.scsswatch)
        .pipe(sourcemaps ? sourcemaps.init() : noop())
        .pipe(sass(cssConfig))
        .on("error", sass.logError)
        // .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps ? sourcemaps.write() : noop())
        .pipe(size({ showFiles:true}))
        .pipe(dest(config.dist.css))
        .pipe(browsersync ? browsersync.reload({ stream: true }) : noop());
}

exports.style  = styleTask;

// -----------------------------------------------------------------------------
// Javascript
// -----------------------------------------------------------------------------

function scriptsTask(){
    return src(config.node.js)
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(dest(config.dist.js))
}

exports.script  = scriptsTask;
// gulp.task('scripts', function() {
//     return gulp.src([
//             './bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
//             'js/main.js'
//         ])
//       .pipe(concat({ path: 'main.js'}))
//       .pipe(browserSync.reload({stream:true}))
//       .pipe(gulp.dest(siteOutput + '/js'));
//   });

  

// -----------------------------------------------------------------------------
// Templating
// -----------------------------------------------------------------------------

// gulp.task('nunjucks', function() {
//     nunjucksRender.nunjucks.configure(['./templates/']);
//     // Gets .html and .nunjucks files in pages
//     return gulp.src(inputTemplates)
//     // Renders template with nunjucks
//     .pipe(nunjucksRender())
//     // output files in dist folder
//     .pipe(gulp.dest(siteOutput))
//   });


// -----------------------------------------------------------------------------
// Imagemin
// -----------------------------------------------------------------------------

const imgConfig = {
    optimizationLevel: 5
}

function imageTask() {

    return src(config.src.img)
      .pipe(newer(config.dist.img))
      .pipe(imagemin(imgConfig))
      .pipe(size({ showFiles:true }))
      .pipe(dest(config.dist.img));

  }

  exports.images=imageTask;

// gulp.task('img', function() {
//     return gulp.src('./img/**/*')
//       .pipe(imagemin({
//         progressive: true,
//         svgoPlugins: [{removeViewBox: false}],
//         use: [pngquant()]
//       }))
//       .pipe(gulp.dest(siteOutput + '/img'));
//   });


// -----------------------------------------------------------------------------
// Server 
// -----------------------------------------------------------------------------
const syncConfig = {
    server: {
        baseDir: config.dist.root
       
    },
    browser: "chrome",
    // port: 3010,
    port        : 8000,
    open        : true
  };
  function done(){
      console.log('task completed');
      
  }
  // browser-sync
  function server(done) {
    if (browsersync) browsersync.init(syncConfig);
    console.log(done);
    done();
  }


// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------

function watchTask(done){

    watch(config.src.scsswatch, styleTask)
    watch(config.src.imgwatch, imageTask)
    watch(config.src.jswatch, scriptsTask)
    done();
}


// -----------------------------------------------------------------------------
// Export Functions
//  use gulp, gulp style, gulp script in cli
// -----------------------------------------------------------------------------
 



exports.watch  = watchTask;



exports.default  =  series(
    styleTask,scriptsTask,
    watchTask, server
);
 