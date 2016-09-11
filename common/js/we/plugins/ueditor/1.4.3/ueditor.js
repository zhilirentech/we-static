define(function (require, exports, module) {
	require('./ueditor.config.js');
	require('./ueditor.all.js');
	var init = function(options){
		var op = $.extend({},options);
		UE.delEditor('editor');
		UE.getEditor('editor',{
			initialFrameHeight :300,
			autoHeightEnabled :false
		});
	}
	return{
		init:init
	}	
})