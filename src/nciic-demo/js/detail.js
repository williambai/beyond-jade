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
  $('#submit').bind('click',function(evt){
      var username = $('#name').val();
      var identification = $('#identification').val();
      if(validate(username,identification)) return;
      var load = $('#loading').css('display');
      if(load == 'none'){
        $('#loading').css('display','block');
          var dataPost = { 
              name:username,
              id:identification
          };

        $.ajax({
          url: '/check-detail',
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
              // result += parseRTS(response.rts);
              person.push({
                xm: xm,
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
      }
    });
});