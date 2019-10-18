import gulp from "gulp";
import { style } from "./style";
import browserSync from 'browser-sync';
import config from '../config';

export const watch=()=>{
    gulp.watch(config.src.scsswatch, style);
}