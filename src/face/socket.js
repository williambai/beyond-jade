var cv = require('opencv');
var fs = require('fs');
var async = require('async');

// face detection properties
var rectColor = [0, 255, 0];
var rectThickness = 2;

module.exports = function (socket) {
  socket.on('snapshot',function(data){
    // extract raw base64 data from Data URI
    var raw_image_data = data.image.replace(/^data\:image\/\w+\;base64\,/, '');
    var buffer = new Buffer(raw_image_data,'base64');
    cv.readImage(buffer,function(err,mat){
      if (err) throw err;
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
            if(err) throw err;
            var _mat = mat.crop(0,0,1,1);
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
                //crop face
                _mat = mat.crop(face.x,face.y,face.width,face.height);//roi()
                // _mat.convertGrayscale();
                var face_data = (_mat && _mat.toBuffer()) || mat.toBuffer();
                var face_url = 'data:image/' + 'png' +';base64,' + face_data.toString('base64');
                socket.emit('face',{face: face_url});
                break;
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