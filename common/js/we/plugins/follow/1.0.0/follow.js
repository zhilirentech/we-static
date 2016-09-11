/**
 * @name 	 关注
 * @class 	 请求接口必须已ID的方式写在按钮上 如：<button st="button" class="btn btn-follow follow" id="${university.id }" >+关注</button>
 * @Author   汪洋
 * @requires jQuery
 * @DateTime 2016-08-22T17:36:45+0800
 * @param    {addUrl:String}[添加关注ajax请求接口]
 * @param    {cancelUrl:String}[取消关注ajax请求接口]
 * @param    {alreadyUrl:String}[回显已关注ajax请求接口]
 * @param    {el:'.follow'}[关注按钮className]
 * @param    {sign:'follow' 默认:}[自定义关注状态标签]
 * @param    {state:false}[关注后是否可以取消关注]
 * @param    {followstatus:false}[是否调用回显已关注功能]
 * @param    {addUI:Function}[关注后设置UI回调方法]
 * @param    {removeUI:Function}[取消关注后设置UI回调方法]
 * @version  v1.0.0
 */
define(function (require) {
	var init = function(options){
		if(!we.isLogin){
			return false;
		}
		var op = $.extend({
			addUrl:'http://znpt.sxw100.com/follow/add.json',
			cancelUrl:'http://znpt.sxw100.com/follow/cancelb.json',
			alreadyUrl:'http://znpt.sxw100.com/follow/isFollow.json',
			el:'.follow',	//关注按钮className
			sign:'follow',	//自定义关注状态标签
			state:false,	//关注后是否可以取消关注
			followstatus:true,	//是否调用回显已关注功能
			addUI:function(element){	//关注后回调方法
				element.addClass('crt').text('已关注');
			},
			removeUI:function(element){//取消关注后回调方法
				element.removeClass('crt').text('+关注');
			}
		},options);
		$(op.el).attr(op.sign,false);
		var alreadyFollow = function(element){
			var sourceIds = [];
			for (var i = 0; i < element.length; i++) {
				sourceIds[i] = element.eq(i).attr('id');
			}
			$ajax.weAjax({
				url:op.alreadyUrl,
				data:{
					sourceIds:sourceIds,
					sourceType:1
				},
				traditional: true, 
				success:function(data){
					for(var i in data){
						var id = i.substr(0,4);
						op.addUI($('*[id='+id+']'));
						$('*[id='+id+']').attr(op.sign,data[i]);
					}
					seajs.log('已关注');
				},
				error:function(data){
					seajs.log('未关注');
				}
			});
		}
		
		if(op.followstatus==true){
			alreadyFollow($(op.el));
		}else{
			$(op.el).attr(op.sign,true);
		}

		var getAjax = function(element,msg,url){
			$ajax.weAjax({
				url:url,
				data:{
					sourceId:element.attr('id'),
					sourceType:1,
					followId:element.attr('id')
				},
				success:function(data){
					$wedialog.alert({
						title:'温馨提示',
						content:msg+'成功',
						padding:'30px 100px',
						ok:function(){},
						okValue:'确认'
					});
					seajs.log(msg+'成功');
				},
				error:function(data){
					seajs.log(msg+'失败');
				}
			});
		}

		var addFollow = function(element){
			element.attr(op.sign,true);	
			op.addUI(element);
			getAjax(element,'关注',op.addUrl);
		}

		var cancelFollow = function(element){
			element.attr(op.sign,false);	
			op.removeUI(element);
			getAjax(element,'取消',op.cancelUrl);
		}

		$(op.el).live('click',function(){
			var attr = $(this).attr(op.sign);
			if(op.state==true){
				attr=='false'?addFollow($(this)):cancelFollow($(this));
			}else{
				attr=='false'?addFollow($(this)):true;
			}
		})

	};
	return{
		init:init
	}
});