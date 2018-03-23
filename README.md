# reVue

### 构建开发环境
#### 具体需求：
1. 开发环境服务器搭建；
2. 服务器热更新；
3. 构建自动化。

#### 开发环境服务器搭建
使用 BrowserSync 来构建服务器，其支持命令行以及 gulp 集成

``` javascript
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 3200,        
    });        
});
```

#### 服务器热更新
BrowserSync 内置监听相应文件实现热更新功能，集成 gulp 任务如下
``` javascript
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 3200,        
    });
    // 监听 js 文件，然后刷新服务器
    gulp.watch('./dist/*.js').on('change', browserSync.reload)  
});
```

#### 构建自动化
自动化工具使用 gulp 来构建
``` javascript
    // browser-sync 任务就是一个搭建服务器过程
    // watch-webpack 则是在打包并且监听改动增量打包
    gulp.task('default', ['browser-sync', 'watch-webpack']);
    // 监听模式打包
    gulp.task('watch-webpack', function() {
        var config = require('./webpack.config.js');
        return gulp.src('index.js')
            .pipe(webpack(config))
            .pipe(gulp.dest('dist/'));
    });
```
最后在 package.json 文件中配置，npm 语句进行任务监听

``` javascript
...
"scripts": {    
    "dev": "gulp"
},

...
```
开发环境运行只需要 `npm run dev` 即可。  

整体构建过程如下：
代码文件变动 -> 触发 webpack 增量打包 > 触发浏览器更新 > 实时看到效果


