import { src, dest, parallel } from "gulp";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import config from "../config";


export const copyFont =()=>{
    return src(config.src.fontswatch)
        .pipe(plumber({errorHandler:notify.onError("Error: <%= error.message %>") }))
        .pipe(dest(config.dist.fonts))

}

export const copyData=()=>{
    return src(config.src.datawatch)
        .pipe(plumber({errorHandler:notify.onError("Error: <%= error.message %>") }))
        .pipe(dest(config.dist.data))

}

export default parallel(copyFont, copyData);