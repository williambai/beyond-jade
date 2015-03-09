$(function(){
 
  $('#content').html(_.template($('#template_content').html()));

  var validate = function(text){
    $('#message').html('').removeClass('alert').removeClass('alert-warning');
    var error = '';
    text.length <=0 && (error += '不能为空<br/>'); 

    var _pairs = [],_pair,_items = text.split(';');
    // console.log(_items);
    for(var i=0;i<_items.length;i++){
      _pair = _items[i].split(' ');
      // console.log(_pair);
      _pairs.push({name:_pair[0],id:_pair[1]})
    }
    if(error.length > 0){
      $('#message').html(error).addClass('alert').addClass('alert-warning');
      return false;
    }else{
      return _pairs; 
    } 
  };
  $('#submit').bind('click',function(evt){
      var _multiPairs = validate($('#multi').val());
      if(!_multiPairs) return;
      var load = $('#loading').css('display');
      if(load == 'none'){
        $('#loading').css('display','block');
          // var dataPost = { 
          //   data:_multiPairs,
          // };
        $.ajax({
          url: '/check',
          type: 'POST',
          data: JSON.stringify(_multiPairs),
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
              for(var i in responses){
                var response = responses[i];
                var xm,gmsfhm,result = '';

                //parse response.input
                gmsfhm = parseGMSFHM(response.input);
                xm =parseXM(response.input);

                //parse response.output, ignoreDetail == undefined
                result += parseOUTPUT(response.output);
                //parse response.rts
                // result += parseRTS(response.rts);
                person.push({
                  xm: xm,
                  gmsfhm: gmsfhm,
                  result: result
                });
              }
            //render data
            var _templated = _.template($('#template_result').html());
            $('#content').html(_templated({data:person}));
            $('#submit').bind('click',function(){
              history.back();
            });
          },
          error: function(err){
            toast('服务器错误，请联系系统管理员。');
          },
        });
        $('#loading').css('display','none');
      }
    });
});