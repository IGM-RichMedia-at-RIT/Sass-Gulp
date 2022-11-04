const gulp =  require('gulp');
const sass = require('gulp-sass')(require('sass'));
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config');
const eslint = require('gulp-eslint-new');
const nodemon = require('gulp-nodemon');

const sassTask = (done) =>{

    gulp.src('./scss/main.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('./hosted'));
        
    done();
}

const webpackTask = (done) =>{

    webpack(webpackConfig)
        .pipe(gulp.dest('./hosted'));

    done();
}

const lintTask = (done) =>{

    gulp.src('./server/**/*.js')
        .pipe(eslint({fix:true}))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())//looks at at all the folders in server and only look at js files

    done();
}
const watch = (done) =>{
    gulp.watch('./scss',sassTask);
    gulp.watch(['./client/**/.js','./client/**/*jsx'],webpackTask);
    nodemon({
        script: './server/app.js',
        tasks: ['lintTask'],
        watch: ['./server'],
        done: done
    });
};

module.exports = {
    build: gulp.parallel(sassTask,webpackTask,lintTask),
    sassTask,
    webpackTask,
    lintTask,
    watch
}