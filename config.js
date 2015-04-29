/**
 * select one project from existed projects.
 */
exports = module.exports = function(config){
	project_ibeacon(config);
};

var project_face = function(config){
	config.src = 'src/face';
	config.dest = 'dist/face';
};

var project_ibeacon = function(config){
	config.src ='src/ibeacon';
	config.dest = 'dist/ibeacon';	
};