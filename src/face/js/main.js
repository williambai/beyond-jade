var socket = io.connect('http://localhost');
var images = ['images/demo.jpg','images/demo.jpg','images/demo.jpg','images/demo.jpg','images/demo.jpg','images/demo.jpg'];


Webcam.attach('#my_camera');
Webcam.on('error',function(){
	Webcam.reset();	
});

Webcam.on('live',function(){

	setInterval(function(){
		Webcam.snap(function(data_uri){
			socket.emit('snapshot',{image:data_uri});
			 if(images.length < 6){
			 	images.push(data_uri);
			 }else{
			 	images.shift();
			 	images.push(data_uri);
			 }
			 var html = '';
			 for(var i=0; i < 6; i++){
			 	html += '<div class="col-md-2">';
			 	html += '<img src="' + images[i] + '" width="100%">';
			 	html += '</div>';
			 }
			 $('#my_snaps').html(html);

		});
	},200);
});
var faces = ['images/demo.jpg','images/demo.jpg','images/demo.jpg','images/demo.jpg','images/demo.jpg','images/demo.jpg'];

socket.on('face',function(data){
	if(faces.length < 6){
		faces.push(data.face);
	}else{
		faces.shift();
		faces.push(data.face);
	}
	var html = '';
	for(var i=0; i < 6; i++){
		html += '<div class="col-md-2">';
		html += '<img src="' + faces[i] + '" width="100%">';
		html += '</div>';
	}
	$('#my_faces').html(html);
});

socket.on('pic',function(data){
	var html = '';
	for(var i=0; i < 6; i++){
		html += '<div class="col-md-2">';
		html += '<img src="' + data.face + '" width="100%">';
		html += '</div>';
	}
	$('#my_pics').html(html);

})
