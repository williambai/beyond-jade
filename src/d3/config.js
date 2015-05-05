exports = module.exports = function(config) {
	var chartbuilderRoot = 'bower_components/chartbuilder/';

	config.plugin.css.push(chartbuilderRoot + 'bower_components/html5-boilerplate/css/normalize.css');
	config.plugin.css.push(chartbuilderRoot + 'bower_components/html5-boilerplate/css/main.css');
	config.plugin.css.push(chartbuilderRoot + 'bower_components/really-simple-color-picker/colorPicker.css');
	config.plugin.css.push(chartbuilderRoot + 'css/chartbuilder.css');
	config.plugin.css.push(chartbuilderRoot + 'css/gneisschart.css');
	config.plugin.css.push(chartbuilderRoot + 'css/colorPicker.css');

	config.plugin.js.push(chartbuilderRoot + 'bower_components/modernizr/modernizr.js');
	config.plugin.js.push(chartbuilderRoot + 'bower_components/d3/d3.v2.min.js');
	config.plugin.js.push(chartbuilderRoot + 'bower_components/canvg/canvg.js');
	config.plugin.js.push(chartbuilderRoot + 'bower_components/rgbcolor/index.js');
	config.plugin.js.push(chartbuilderRoot + 'bower_components/jquery-csv/index.j');
	config.plugin.js.push(chartbuilderRoot + 'bower_components/really-simple-color-picker/jquery.colorPicker.min.js');
	config.plugin.js.push(chartbuilderRoot + 'bower_components/webfontloader/target/webfont.js');
	config.plugin.js.push(chartbuilderRoot + 'bower_components/sugar/release/sugar.min.js');
	config.plugin.js.push(chartbuilderRoot + 'js/gneisschart.js');
	config.plugin.js.push(chartbuilderRoot + 'js/chartbuilder.js');
};
