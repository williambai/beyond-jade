var images = ['images/demo.jpg','images/demo.jpg','images/demo.jpg','images/demo.jpg','images/demo.jpg','images/demo.jpg'];


Webcam.attach('#my_camera');
Webcam.on('error',function(){
	Webcam.reset();	
});

Webcam.on('live',function(){

	setInterval(function(){
		Webcam.snap(function(data_uri){
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