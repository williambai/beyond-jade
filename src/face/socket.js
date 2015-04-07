var cv = require('opencv');
var fs = require('fs');
var path = require('path');
var async = require('async');

// face detection properties
var rectColor = [0, 255, 0];
var rectThickness = 2;
//predict
var faceRecognizer = new cv.FaceRecognizer();
faceRecognizer.loadSync(path.join(__dirname,'data','phrase1','model.dat'));

module.exports = function (socket) {
  socket.on('snapshot',function(data){
    // extract raw base64 data from Data URI
    var raw_image_data = data.image.replace(/^data\:image\/\w+\;base64\,/, '');
    var buffer = new Buffer(raw_image_data,'base64');
    cv.readImage(buffer,function(err,mat){
      if (err) throw err;
      if(mat.width < 1 && mat.height < 1){
        return;
      }
      async.series(
      // async.parallel(
        [
          function(next){
            mat.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt.xml', 
              {}, next);
          },
          function(next){
            mat.detectObject('./node_modules/opencv/data/haarcascade_mcs_eyepair_small.xml', 
              {}, next);
          },
          function(next){
            mat.detectObject('./node_modules/opencv/data/haarcascade_mcs_lefteye.xml', 
              {}, next);
          },
          function(next){
            mat.detectObject('./node_modules/opencv/data/haarcascade_mcs_righteye.xml', 
              {}, next);
          },
        ],
        function(err,result){
            if(err) throw err;
            console.log(result);
            var faces = result[0];
            var eyes = result[1];
            var leftEyes = result[2];
            var rightEyes = result[3];
            //face found
            for (var i = 0; i < faces.length; i++) {
                var face = faces[i];
                // mat.ellipse(face.x + face.width/2,
                //   face.y + face.height/2,
                //   face.width/2,
                //   face.height/2,
                //   rectColor,
                //   rectThickness
                //   );
                //search eye
                var hasEye = false;
                for (var j = 0; j < eyes.length; j++) {
                    var eye = eyes[j];
                    // mat.ellipse(eye.x + eye.width/2,
                    //   eye.y + eye.height/2,
                    //   eye.width/2,
                    //   eye.height/2,
                    //   rectColor,
                    //   rectThickness
                    // );
                    if(eye.x > face.x && eye.y > face.y && eye.width < face.width && eye.height < face.height){
                        hasEye = true;
                      // search leftEye
                      var hasLeftEye = false;
                      for(var k =0; k < leftEyes.length; k++){
                        var leftEye = leftEyes[k];
                        if(leftEye.x >= eye.x && leftEye.y >= eye.y){
                          hasLeftEye = true;
                          //search rightEye
                          var hasRightEye = false;
                          for(var m =0; m < rightEyes.length; m++){
                            var rightEye = rightEyes[m];
                            if(rightEye.x <= (eye.x + eye.width) && rightEye.y <= (eye.y + eye.height)){
                              hasRightEye = true;
                              //crop face
                              var _mat;
                              _mat = mat.crop(face.x,face.y,face.width,face.height);//roi()
                              // _mat.convertGrayscale();
                              var face_data = (_mat && _mat.toBuffer()) || mat.toBuffer();
                              var face_url = 'data:image/' + 'png' +';base64,' + face_data.toString('base64');
                              var positive_dir = path.join(__dirname,'data','raw','positive');
                              fs.readdir(positive_dir,function(err,files){
                                if(files.length < 100){
                                  _mat.save(positive_dir + '/' + (new Date().getTime()) + '.jpg');
                                }
                              });
                              socket.emit('face',{face: face_url});
                              //predict
                              var report = faceRecognizer.predictSync(_mat);
                              socket.emit('report',{report:report});
                              console.log(report);
                              break;
                            }
                          }
                        }
                      }
                    }
                }
            }

        }
      );
    });
  });

  (function(){
    cv.readImage('./images/_1.jpg',function(err,mat){
      if(err) throw err;
      mat.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt.xml', 
        {}, 
        function(err, faces) {
          var _mat = mat.crop(0,0,1,1);
          if (err) throw err;
          for (var i = 0; i < faces.length; i++) {
            face = faces[i];
            mat.ellipse(face.x + face.width/2, 
              face.y + face.height/2, 
              face.width/2, 
              face.height/2,
              rectColor, 
              rectThickness
              );
            _mat = mat.crop(face.x,face.y,face.width,face.height);//roi()
            _mat.convertGrayscale();
          }
          var face_data = (_mat && _mat.toBuffer()) || mat;
          var face_url = 'data:image/' + 'png' +';base64,' + face_data.toString('base64');
          socket.emit('pic',{face: face_url});
        }
      );
    });
  })();
};