/**
 * biz logics
 */

var parseXM = function(input){
    var result = '';
    if(input){
      result += input.xm || '';
    }
    return result;
}
var parseGMSFHM = function(input){
	var result = '';
    if(input){
      result += input.gmsfhm || '';
    }	
    return result;
}

var parseOUTPUT = function(input, ignoreDetail){
	var result = '';
    var result_gmsfhm='',result_xm='';
    if(input && input.item){
      var items = input.item
      for(var i in items){
        if(items[i].result_xm !== undefined){
          result += '姓名：' + items[i].result_xm + '<br>';
        }else if(items[i].result_gmsfhm !== undefined){
          result += '公民身份证号码: ' + items[i].result_gmsfhm + '<br>';
        }else if(items[i].errormesage !== undefined){
          result += '错误信息: ' + items[i].errormesage + '<br>';
        }else if(items[i].errormesagecol !== undefined){
          result += '附加信息: ' + items[i].errormesagecol + '<br>';
        }else if(items[i].xp !== undefined){
        	if(ignoreDetail == undefined){
	          result += '相片: <img width="200px" src="data:image/png;base64,' + items[i].xp + '"/><br>';
	          result += items[i].result_xp || '';
	          result += '<br>' ;
	          result += items[i].result_fx || '';
	          result += '<br>' ;
	          result += items[i].result_fs || '';
        	}
        }else{
        	if(ignoreDetail == undefined){
	          result += JSON.stringify(items[i]) + '<br>';
	      	}
        }
      }
    }
    return result;
}

var parseRTS = function(input){
	var result = '';
	if(input){
	  var rts = [];
	  if(input.rt instanceof Array){
	    rts = input.rt;
	  }else{
	    rts.push(input.rt);
	  }
	  for(var i in rts){
	    var rt = rts[i];
	    result += rt.dn + '<br>';                                 
	    if(rt && rt.rows){
	      var rows = [];
	      if(rt.rows.row instanceof Array){
	        rows = rt.rows.row;
	      }else{
	        rows.push(rt.rows.row);
	      }
	      console.log('++++++');
	      console.log(rows);
	      for(var k in rows){
	        var row = rows[k];
	        if(row && row.output && row.output.item){
	          items = row.output.item;
	          for(var j in items){
	            result += JSON.stringify(items[j]) + '<br>';
	          }                  
	        }
	      }
	    }
	  }
	}
	return result;
}


var getUrlParams = function(){
	var params = {};
	var search = window.location.search.substr(1).split('&'),item;
	for(var i = 0 ; i<search.length ; i ++){
		item = search[i].split('=');
		params[item[0]] = item[1] || '';
	}
	return params;
};

var toast = function(message){
	if(typeof(window.Android) == 'undefined'){
		alert(message);
	}else{
		window.Android.showToast(message); 
	}
};

var openNewView = function(url){
	if(typeof(window.Android) == 'undefined'){
		location.href = url;
	}else{
		window.Android.showNewView('file:///android_asset/html/' + url);
	}
};

var saveData = function(key,value){
	if(typeof(key) == 'string' && (typeof(value) == 'string' || typeof(value) == 'object')){
		if(typeof(window.Android) == 'undefined'){
			if(window.localStorage){
			    storage = window.localStorage;
			    storage.setItem(key,JSON.stringify(value));
			}
		}else{
			window.Android.setData(key, JSON.stringify(value));
		}
	}
};

var getData = function(key){
	var value='';
	if(typeof(key) == "string"){
		if(typeof(window.Android) == 'undefined'){
			if(window.localStorage){
			    value = window.localStorage.getItem(key);
			}
		}else{
			value = window.Android.getData(key);
		}
	}
	try{
		var data = JSON.parse(value);
		return data;
	}catch(e){

	}
	return '';
}

/**
 * functions
 */
var isLogined = function(){
	var accessToken = getData('accessToken');
	if(typeof accessToken != 'undefined' && accessToken != null && accessToken != '') {
		return true;	
	}
	saveData('deviceid', '');
	return false;
}
