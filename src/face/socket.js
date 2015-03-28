var cv = require('opencv');
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

      mat.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt.xml', 
        {}, 
        function(err, faces) {
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

            // mat.rectangle(
            //   [face.x, face.y], 
            //   [face.x + face.width, face.y + face.height], 
            //   rectColor, 
            //   rectThickness
            // );
          }
          var face_data = mat && mat.toBuffer();
          var face_url = 'data:image/' + 'png' +';base64,' + face_data.toString('base64');
          socket.emit('face',{face: face_url});
        }
      );
    });
  });
};