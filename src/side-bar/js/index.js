(function($){
	console.log('++++');
	$("#menu-toggle").click(function(e) {
	   $("#wrapper").toggleClass("left-sidebar-toggled");
	   e.preventDefault();
	});
}(jQuery));
