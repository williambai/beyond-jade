$(function(){
 
  $('#content').html(_.template($('#template_content').html()));
  var validate = function(username,identification){
    $('#message').html('').removeClass('alert').removeClass('alert-warning');
    var error = '';
    username.length <=0 && (error += '用户名不能为空<br/>'); 
    identification.length <=0 && (error += '身份证号不能为空'); 
    if(error.length > 0){
      $('#message').html(error).addClass('alert').addClass('alert-warning');

      return true;
    }else{
      return false; 
    } 
  };

  $('input[type="file"').bind('change',function(evt){
  	evt.preventDefault();
	$.ajax({
		url: '/upload',  //Server script to process data
		type: 'POST',
		processData: false,
		contentType: false,
		data: (new FormData($('form')[0])),
		success: function(response){
			// console.log(response);
		  	$('#img').html('<img width="200px" src="' + response.url +'">');
		},
		error: function(err){
			alert('服务器错误，请联系系统管理员。');
		}
	});  	
  });

  $('#submit').bind('click',function(evt){
      var username = $('#name').val();
      var identification = $('#identification').val();
      var file_url = $('#img img').attr('src');
      if(validate(username,identification)) return;
      var load = $('#loading').css('display');
      if(load == 'none'){
        $('#loading').css('display','block');
		var dataPost = { 
		  name:username,
		  id:identification,
		  url: file_url 
		};

        $.ajax({
          url: '/check-photo',
          type: 'POST',
          data: JSON.stringify(dataPost),
          contentType:'application/json',
          success: function(out){
              // console.log(out);
              var responses = [];
              if(out instanceof Array){
                responses = out;
              }else{
                responses.push(out);
              }
              var person =[];
              var response = responses[0];
              var xm,gmsfhm,result = '';

              //parse response.input
              gmsfhm = parseGMSFHM(response.input);
              xm =parseXM(response.input);

              //parse response.output
              result += parseOUTPUT(response.output);
              //parse response.rts
              result += parseRTS(response.rts);

              person.push({
                xm: xm + '<br>相片: <img width="200px" src="' + file_url + '"/><br>',
                gmsfhm: gmsfhm,
                result: result
              });

              //render data
              var _templated = _.template($('#template_result').html());
              $('#content').html(_templated({data:person}));
              $('#submit').bind('click',function(){
            	history.back();
			  });
          },
          error: function(err){
            alert('服务器错误，请联系系统管理员。');
          },
        });
        $('#loading').css('display','none');
        return false;
      }
    });
});