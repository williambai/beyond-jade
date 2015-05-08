/**
 * select one project from existed projects.
 */
exports = module.exports = function(config){
	project_ask_for_leave(config);
	// project_ibeacon(config);
	// project_d3(config);
	// project_face(config);
};

var project_ask_for_leave = function(config){
	config.src = 'src/ask-for-leave';
	config.dest = 'dist/ask-for-leave';
};

var project_face = function(config){
	config.src = 'src/face';
	config.dest = 'dist/face';
};

var project_ibeacon = function(config){
	config.src ='src/ibeacon';
	config.dest = 'dist/ibeacon';	
};

var project_d3 = function(config){
	config.src ='src/d3';
	config.dest = 'dist/d3';	
};