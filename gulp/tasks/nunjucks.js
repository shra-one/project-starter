import { src, dest } from "gulp";
import plumber from "gulp-plumber";
import notify from 'gulp-notify';
import yargs from 'yargs';
import nunjucksRender from "gulp-nunjucks-render";
import { readJson } from "fs-extra";
import data from "gulp-data";
import config from '../config';
 

const PRODUCTION = yargs.argv.prod;
const nunjucksConfig = {
    path: config.src.html,
    data: {
        css_url: './assets/css/',
        img_url: './assets/images/'
    }

}

const nunjucks = () => {
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

export default nunjucks