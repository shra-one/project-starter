var baseUrl="dist/";
var root="";
var assets= `${baseUrl}assets/`


module.exports = {
    src: {
        root: 'src/',
        scss: 'src/scss/',
        scsswatch: 'src/scss/**/*.scss',
        img: 'src/images/',
        imgwatch:'src/images/**/*',
        js: 'src/js/',
        jswatch: 'src/js/**/*',
        fonts: 'src/fonts/',
        fontswatch: 'src/fonts/**/*',
        data: 'src/data/',
        datawatch: 'src/data/**/*',
        html:'src/html/',
        htmlwatch:'src/html/**/*'
    },
    dist: {
        root:baseUrl,
        css: assets+'css/',
        img: assets+'images/',
        js: assets+'js/',
        fonts: assets+'fonts/',
        data: assets+'data/',
        html:baseUrl

    },
    node: {
        root: 'node_modules/',
        css: [
            'node_modules/bootstrap/scss/',
            // 'node_modules/@fortawesome/fontawesome-free-webfonts/scss/',
            'node_modules/drop-shadow-converter/scss/',

        ],
        fonts: [
            // 'node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/'
        ],

        js: [
            './node_modules/jquery/dist/jquery.js',
            './node_modules/bootstrap/dist/js/bootstrap.bundle.js',
            './node_modules/wowjs/dist/wow.js',
            './src/js/scripts/main.js',
            './src/js/scripts/form.js'
            
        ]
    }
}