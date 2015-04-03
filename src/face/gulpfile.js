var gulp = require('gulp');
var seq = require('run-sequence');
var async = require('async');
var cv = require('opencv');
var path = require('path');
var fs = require('fs');

var config = {
	src: path.join(__dirname,'data','raw'),
	phrase1: path.join(__dirname,'data','phrase1'),
};

var detectObjectInFile = function(files,callback){
	//回调函数(queue)
	var func = function(files){
		var file = files.shift();
		console.log('file:' + file);
		if(file === undefined){
			callback();
			return;
		}
		if(file.indexOf('.jpg') == -1){
			func(files);
			return;
		}
		cv.readImage(path.join(config.src,'negative',file),function(err,mat){
			if(err) {
				callback();
				return;
			}
			console.log(mat);
			if (mat.width() > 0 && mat.height() > 0){
			  async.series(
			    [
			      function(next){
			        mat.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt.xml', 
			          {}, next);
			      },
			      function(next){
			        mat.detectObject('./node_modules/opencv/data/haarcascade_mcs_eyepair_small.xml', 
			          {}, next);
			      },
			    ],
			    function(err,result){
			        if(err) {
			        	callback();
			        	return;
			        }
			        var _mat = mat.crop(0,0,1,1);
			        //face found
			        console.log(result[0]);
			        var faces = result[0];
			        for (var i = 0; i < faces.length; i++) {
			            face = faces[i];
			            // mat.ellipse(face.x + face.width/2,
			            //   face.y + face.height/2,
			            //   face.width/2,
			            //   face.height/2,
			            //   rectColor,
			            //   rectThickness
			            //   );
			            //eye found
			            // console.log(result[1]);
			            var eyes = result[1];
			            for (var i = 0; i < eyes.length; i++) {
			                eye = eyes[i];
			                // mat.ellipse(eye.x + eye.width/2,
			                //   eye.y + eye.height/2,
			                //   eye.width/2,
			                //   eye.height/2,
			                //   rectColor,
			                //   rectThickness
			                // );
			            }
			            //crop face
			            _mat = mat.crop(face.x,face.y,face.width,face.height);//roi()
			            _mat.convertGrayscale();
		                _mat.save(path.join(config.phrase1,'negative',file));
			            break;
			        };
			        func(files);
		        }
			  );
			}else{
		        func(files);			
			}
		});
	};
	func(files.slice());
}

gulp.task('negative-phrase1',function(done){
	//negative files
	fs.readdir(path.join(config.src, 'negative'),function(err,files){
		var negative_path = path.join(config.phrase1,'negative');
		if(!fs.existsSync(negative_path)){
			if(!fs.existsSync(config.phrase1)){
				fs.mkdirSync(config.phrase1,0777);
			}
			fs.mkdirSync(negative_path,0777);
		}
		detectObjectInFile(files,function(){
			done();
		});
	});
});

gulp.task('positive-phrase1',function(done){
	//positive files
	fs.readdir(config.src + '/positive',function(err,files){
		var positive_path = path.join(config.phrase1,'positive');
		if(!fs.existsSync(positive_path)){
			if(!fs.existsSync(config.phrase1)){
				fs.mkdirSync(config.phrase1,0777);
			}
			fs.mkdirSync(positive_path,0777);
		}
		files.forEach(function(file){
			if(file.indexOf('.jpg') != -1){
				cv.readImage(path.join(config.src,'positive',file),function(err,mat){
					// console.log(mat);
					//to gray
					mat.convertGrayscale();
					mat.save(path.join(config.phrase1,'positive',file));
				});
			}
		});
		// console.log('finished!');
		done();
	});
});

gulp.task('file-list',function(done){
	var file_list = '';
	if(fs.existsSync(path.join(config.phrase1,'positive'))){
		file_list += fs.readdirSync(path.join(config.phrase1,'positive')).join(';1\n' + './positive/').replace('.DS_Store;1\n', '') + ';1\n';
	}
	if(fs.existsSync(path.join(config.phrase1,'negative'))){
		file_list += fs.readdirSync(path.join(config.phrase1,'negative')).join(';0\n' + './negative/').replace('.DS_Store;0\n', '') + ';0\n';
	}
	// console.log(file_list);
	fs.writeFileSync(path.join(config.phrase1,'files.txt'),file_list);
	done();
});

gulp.task('lbph-training',function(done){
	var cvImages = [];
	var lines = fs.readFileSync(path.join(config.phrase1,'files.txt'),'utf8').split('\n');
	lines.forEach(function(line){
		if(line.indexOf(';') != -1){
			var arr = line.split(';');
			cv.readImage(path.join(config.phrase1,arr[0]),function(err,im){
				cvImages.push(new Array(parseInt(arr[1]),im));
			});
		}
	});
	// console.log(cvImages);
	var faceRecognizer = new cv.FaceRecognizer();
	faceRecognizer.trainSync(cvImages);
	faceRecognizer.saveSync(path.join(config.phrase1,'model.dat'));
	done();
});

gulp.task('lbph-predict',function(done){
	var faceRecognizer = new cv.FaceRecognizer();
	faceRecognizer.loadSync(path.join(config.phrase1,'model.dat'));
	var report = faceRecognizer.predictSync(path.join(config.phrase1,'negative','i.jpg'));
	console.log(report);
	done();
});

gulp.task('default',function(done){
	var tasks = ['negative-phrase1','positive-phrase1','file-list','lbph-training'];
	seq(tasks,done);
});
