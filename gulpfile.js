var config = {
	src: 'src/d3',
	dest: 'dist/d3',
	server: {
		host: '0.0.0.0',
		port: '8000'
	},
	plugin: {
		fonts: [
		   './bower_components/bootstrap/dist/fonts/*.*',
   		   './bower_components/font-awesome/fonts/fontawesome-webfont.*'   		   
      	],
      	js: [
      		'./bower_components/jquery/dist/jquery.js',
      		'./bower_components/bootstrap/dist/js/bootstrap.js',
      		'./bower_components/underscore/underscore.js'
      	],
      	css: [
      		'./bower_components/bootstrap/dist/css/bootstrap.css',
      		'./bower_components/bootstrap/dist/css/bootstrap.css.map'
      	],
      	images: [
      	]
	}
};


var gulp = require('gulp');
var connect = require('gulp-connect');
var path = require('path');
var seq = require('run-sequence');
var jade = require('gulp-jade');
var del = require('del');

/*=========================================
=            merge project config         =
=========================================*/

if (require('fs').existsSync(path.join(__dirname, config.src ,'config.js'))){
  var configFn = require(path.join(__dirname, config.src ,'config.js'));
  configFn(config);
};

/*=========================================
=            Clean dest folder            =
=========================================*/

gulp.task('clean',function(cb) {
	del([
		path.join(config.dest,'**/*')
	],cb);
});

/*==========================================
=            Start a web server            =
==========================================*/

gulp.task('connect', function(){
	if(typeof config.server === 'object'){
		connect.server({
			root: config.dest,
			host: config.server.host,
			port: config.server.port,
			livereload: true
		});
	}else{
		throw new Error('Connect is not configure.');
	}
});

/*==============================================================
=            Setup live reloading on source changes            =
==============================================================*/

gulp.task('livereload',function(){
	gulp.src(path.join(config.dest,'*.html'))
		.pipe(connect.reload());
});


/*==================================
=            Copy plugin fonts            =
==================================*/

gulp.task('plugin-fonts',function(){
	gulp.src(config.plugin.fonts)
	.pipe(gulp.dest(path.join(config.dest, 'fonts')));
});

/*==================================
=            Copy plugin CSS       =
==================================*/

gulp.task('plugin-css',function(){
	gulp.src(config.plugin.css)
	.pipe(gulp.dest(path.join(config.dest,'css')));	
});

/*==================================
=            Copy plugin images    =
==================================*/

gulp.task('plugin-images',function(){
	gulp.src(config.plugin.images)
	.pipe(gulp.dest(path.join(config.dest,'images')));
});

/*==================================
=            Copy plugin images    =
==================================*/

gulp.task('plugin-js',function(){
	gulp.src(config.plugin.js)
	.pipe(gulp.dest(path.join(config.dest,'js')));
});


/*======================================================================
=            Compile js                            =
======================================================================*/

gulp.task('js',function(){
	gulp.src(path.join(config.src, 'js/**/*'))
		.pipe(gulp.dest(path.join(config.dest,'js')));
});

/*======================================================================
=            Compile css                            =
======================================================================*/

gulp.task('css',function(){
	gulp.src(path.join(config.src, 'css/**/*'))
		.pipe(gulp.dest(path.join(config.dest,'css')));
});

/*======================================================================
=            Compile css                            =
======================================================================*/

gulp.task('images',function(){
	gulp.src(path.join(config.src, 'images/**/*'))
		.pipe(gulp.dest(path.join(config.dest,'images')));
});

/*======================================================================
=            Compile jade                            =
======================================================================*/

gulp.task('jade',function(){
	gulp.src(path.join(config.src, 'pages/*.jade'))
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(config.dest));
});

/*===================================================================
=            Watch for source changes and rebuild/reload            =
===================================================================*/

gulp.task('watch',function(){
	if(typeof config.server === 'object'){
		gulp.watch([config.dest +'/**/*'],['livereload']);
	}
	gulp.watch(path.join(config.src,'js/**/*'),['js']);
	gulp.watch(path.join(config.src,'css/**/*'),['css']);
	gulp.watch(path.join(config.src,'pages/**/*'),['jade']);
});

/*======================================
=            Build Sequence            =
======================================*/

gulp.task('build',function(done) {
	var tasks = [
					'plugin-fonts',
					'plugin-css',
					'plugin-images',
					'plugin-js',
					'js',
					'css',
					'images',
					'jade',
				];
	seq('clean',tasks,done);	
});

/*====================================
=            Default Task            =
====================================*/

gulp.task('default',function(done){
	var tasks = [];
	if(typeof config.server === 'object'){
		tasks.push('connect');
	}
	tasks.push('watch');
	seq(tasks,done);
});
