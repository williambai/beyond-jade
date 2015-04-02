var gulp = require('gulp');
var seq = require('run-sequence');
var cv = require('opencv');
var path = require('path');
var fs = require('fs');

var config = {
	src: path.join(__dirname,'data','raw'),
	phrase1: path.join(__dirname,'data','phrase1'),
};

var detectObject = function(mat,next){
	// face detection properties
	var rectColor = [0, 255, 0];
	var rectThickness = 2;
	return function(err,result){
	    if(err) {
	    	next(err);
	    	return;
	    }
	    var _mat = mat.crop(0,0,1,1);
	    if(result instanceof Object){
	    	var temp = result;
	    	result = [];
	    	result.push(temp);
	    }
	    //face found
	    console.log(result[0]);
	    var faces = result[0];
	    for (var i = 0; i < faces.length; i++) {
	        face = faces[i];
	        mat.ellipse(face.x + face.width/2,
	          face.y + face.height/2,
	          face.width/2,
	          face.height/2,
	          rectColor,
	          rectThickness
	          );
	        //eye found
	        if(result[1]){
		        console.log(result[1]);
		        var eyes = result[1];
		        for (var i = 0; i < eyes.length; i++) {
		            eye = eyes[i];
		            mat.ellipse(eye.x + eye.width/2,
		              eye.y + eye.height/2,
		              eye.width/2,
		              eye.height/2,
		              rectColor,
		              rectThickness
		            );
		        }
	        }

	        //crop face
	        _mat = mat.crop(face.x,face.y,face.width,face.height);//roi()
	        // _mat.convertGrayscale();
	        var face_data = (_mat && _mat.toBuffer()) || mat.toBuffer();
	        var face_url = 'data:image/' + 'png' +';base64,' + face_data.toString('base64');
	        var positive_dir = path.join(__dirname,'data','raw','positive');
	        fs.readdir(positive_dir,function(err,files){
	          if(files.length < 30){
	            _mat.save(positive_dir + '/' + (new Date().getTime()) + '.jpg');
	          }
	        });
	        break;
	    }
	    next(null,_mat);
	}
};

gulp.task('phrase1',function(){
	//negative files
	fs.readdir(config.src + '/negative',function(err,files){
		var negative_path = path.join(config.phrase1,'negative');
		if(!fs.existsSync(negative_path)){
			if(!fs.existsSync(config.phrase1)){
				fs.mkdirSync(config.phrase1,0777);
			}
			fs.mkdirSync(negative_path,0777);
		}
		files.forEach(function(file){
			cv.readImage(path.join(config.src,'negative',file),function(err,mat){
				// console.log(mat);

				mat.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt.xml', 
				  {},
				  detectObject(mat,function(err,im){
				  	if(err) throw err;
				  	//to gray
				  	im.convertGrayscale();
				  	im.save(path.join(config.phrase1,'negative',file));
				  })
				);
			});
		});
	});
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
			cv.readImage(path.join(config.src,'positive',file),function(err,mat){
				// console.log(mat);
				//to gray
				mat.convertGrayscale();
				mat.save(path.join(config.phrase1,'positive',file));
			});
		});
	});
});

gulp.task('file-list',function(){
	var file_list = '';
	if(fs.existsSync(path.join(config.phrase1,'positive'))){
		file_list += './positive/' + fs.readdirSync(path.join(config.phrase1,'positive')).join(';1\n' + './positive/') + ';1\n';
	}
	if(fs.existsSync(path.join(config.phrase1,'negative'))){
		file_list += './negative/' + fs.readdirSync(path.join(config.phrase1,'negative')).join(';1\n' + './negative/') + ';0\n';
	}
	// console.log(file_list);
	fs.writeFileSync(path.join(config.phrase1,'files.txt'),file_list);
});

gulp.task('lbph-training',function(){
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

});

gulp.task('lbph-predict',function(){
	var faceRecognizer = new cv.FaceRecognizer();
	faceRecognizer.loadSync(path.join(config.phrase1,'model.dat'));
	var report = faceRecognizer.predictSync(path.join(config.phrase1,'positive','1427941274186.jpg'));
	console.log(report);
	var report = faceRecognizer.predictSync(path.join(config.phrase1,'negative','i.jpg'));
	console.log(report);
});

gulp.task('default',function(done){
	var tasks = ['phrase1'];
	seq(tasks,done);
});
