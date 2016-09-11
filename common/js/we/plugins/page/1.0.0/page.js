define('page',['ajax','we/plugins/page/1.0.0/jquery-page.js','we/plugins/page/1.0.0/page.css'],function (require, exports, module) {

    /**
     * @name Page
     * @class 提供 ajaxPage, linkPage, scrollPage 三种分页
     * @requires jquery
     * @author 李博龙
     * @author 庄君祥
     * 
     * @version v1.0.0  
     */

    var $ = require('jquery');
    require('./jquery-page');
    require('./animate.css');

    //获取分页数据
    var getPageData = function (options) {
        var _error = null;
        
        if($.isArray(options.data)){
        	var pageData = [];
        	if(options.data!=null){
        		pageData = options.data.slice(); 
        	}
        	pageData.push({name:'pageNumber',value:options.number});
        	pageData.push({name:'pageSize',value:options.size});
        }else{
        	var pageData = {};
        	if(!we.utils.isEmpty(options.data) && typeof options.data=='object'){
        		pageData = $.extend({},options.data);
            }
        	if(we.utils.isEmpty(options.number)||options.number<1){
        		pageData.pageNumber=1;
        	}else{
        		pageData.pageNumber = options.number;
        	}
    		pageData.pageSize = options.size;
        }
        var _success = function (data) {
        	if((typeof data=='string'&&we.utils.isEmpty(data)) || (typeof data=='object'&&!we.utils.isEmpty(data)&&we.utils.isEmpty(data.list))){
        		$(options.page).hide().empty();
        		if(!we.utils.isEmpty(options.empty))options.empty.call(this,data);
        		if(!we.utils.isEmpty(options.success))options.success.call(this,data);
        		return;
        	}
        	if(typeof data=='string'){
        		options.appendData(data);
        		return;
        	}
        	data.pager.pageCount = Math.ceil(data.pager.recordCount / data.pager.pageSize);
        	options.pageCount=data.pager.pageCount;
        	options.count=data.pager.recordCount;
        	options.pageNumber=data.pager.pageNumber;
        	options.appendData(data);
        }
        if(!we.utils.isEmpty(options.empty))_error = options.error;
        if(!we.utils.isEmpty(options.ajaxp) && typeof options.ajaxp=='boolean' && options.ajaxp){
        	$ajax.vkoAjaxP({
                url: options.url,
                data: pageData,
                success: _success,
                error: _error
            });
        }else{
        	$ajax.vkoAjax({
                url: options.url,
                data: pageData,
                success: _success,
                error: _error
            });
        }
       
    }

    /**
     * @name Page#ajaxPage
     * @function   
     * @desc ajax填充数据，并拼装分页（页码点击为ajax请求获取数据）。
     * @param {Object} options
     * @example
     * define(function(require) {
     *     $(function() {
     *         var $page = require('page');
     *         $page.ajaxPage({
     *             page: '.pagedome',     //分页容器（class或id）（必选）
     *             list: '.container',    //数据容器（class或id）（必选）
     *             items: '.dd'            //替换的标签（可选，默认替换list下全部）
     *             url: '/page/list.html',//获取分页的服务器地址（必选）
     *             number: 1,             //页数（可选，默认值1）
     *             size: 3,               //每页条数（可选，默认值10）
     *             data: null,            //请求数据时的附加参数（可选，默认值null）
     *             display:8,             //显示多少个页码（可选，默认值10）
     *             firstpage: true        //是否生成第一页数据（可选，默认值true）如果为空则需给page添加属性recordCount pageNumber
     *             success:null           //当分页构建成功后回调方法{function}（可选，默认值null）
     *             empty:callback         //当返回数据位空时的回调方法{function}（可选，默认值null）
     *         });
     *         //后端返回{"pager":{"pageNumber":1,"pageSize":5,"pageCount":2,"recordCount":10},"list":["<li><a href='#'>数据1</a></li>", "<li><a href='#'>数据2</a></li>"],"queryForm":{"subject":0,"grade":0}}
     *     });
     * });
     */
    var ajaxPage = function (options) {
        options = $.extend({
        	page: null,          //分页容器（class或id或选择器）（必选）
        	list: null,          //数据容器（class或id或选择器）（必选）
        	items: null,         //替换的标签（class或id或选择器，可选，默认替换list下全部）
        	url: '',           //获取分页的服务器地址（必选）
        	number: 1,         //页数（可选，默认值1）
        	size: 10,          //每页条数（可选，默认值10）
            data:null,         //请求数据时的附加参数（可选，默认值null）
            display: 10,       //显示多少个页码（可选，默认值10）
            firstpage: true,   //是否生成第一页数据（可选，默认值true）如果为空则需给page添加属性recordCount pageNumber
            count: 0,   		//当前分页记录数
            success:null,       //当分页构建成功后回调方法{function}（可选，默认值null）
            empty:null,         //当返回数据位空时的回调方法{function}（可选，默认值null）
            error:null,
            ajaxp: false,
            style: '1',
            min: false,
            position: 'right',
            update: null
        }, options);

        if (we.utils.isEmpty(options.list) || we.utils.isEmpty(options.page) || we.utils.isEmpty(options.url)) return;
        var display = options.display,
        	firstpage = options.firstpage,
        	$page = (typeof options.page == 'string')?$(options.page):options.page,
        	$list = (typeof options.list == 'string')?$(options.list):options.list,
        	p_created = false;
        var creatPage = function (pager) {
           
        	var hideArrow = false;
        	if($page.size()<1){
        		$list.append('<div class="'+options.page.replace('.','')+'"></div>');
        		$page = $(options.page,$list);
        	}
        	if(pager.pageCount<2){
        		$page.hide().empty();
        		return;
        	}
        	if(pager.pageCount < display){
        		display = pager.pageCount;
        		hideArrow = true;
        	}
           /* $page.show().pagination({
                count: pager.pageCount,
                start: pager.pageNumber,
                position: options.position,
                display: display,
                border: false,
                text_color: '#666',
                background_color: '#fff',
                text_hover_color: 'fff',
                background_hover_color: '#66b0cc',
                onChange: function (page) {
                    options.number = page;
                    getPageData(options);
                }
            });*/
        	if(options.style=='2'){
//        		$page.show().addClass('vkopage').append('点击加载下<span class="vkopage_next">'+options.size+'</span>条记录').bind('click',function(){
        		$page.show().addClass('vkopage').append('<div class="down-show fr nextPage"><i></i></div>').unbind('click').bind('click',function(){
        			if(!p_created)return;
        			if(options.number<=0){
        				options.number=1;
        			}
					options.number++;
					getPageData(options);
					var residue = options.count-options.number*options.size;
					if(residue<=options.size && residue>0){
						$(this).find('.vkopage_next').html(residue);
					}else if(residue<1){
						$(this).hide();
					}
        		});
        	}else{
                
        		$page.show().addClass('vkopage').vkopage({
        			container: $list,
        			count: pager.pageCount,
        			first: "首页",
        			previous: "上一页",
        			next: "下一页",
        			last: "末页",
        			links: "numeric", // blank || title
        			startPage: pager.pageNumber,
        			perPage: we.utils.isEmpty(options.size)?10:options.size,
					midRange: 4,
					startRange: 2,
					endRange: 2,
					keyBrowse: false,
					scrollBrowse: false,
					pause: 0,
					clickStop: false,
					delay: 20,
					direction: "forward", // backwards || auto || random ||
					animation: "", // http://daneden.me/animate/ - any entrance animations
					fallback: 400,
					minHeight: false,
					callback: function( pages, items ) {
						if(!p_created)return;
						options.number = pages.current;
						getPageData(options);
					}
        		});
	        		
        	}
        	
            p_created = true;
            if(hideArrow){
            	$('.vkoPag-sprevious-img',$page).add($('.vkoPag-snext-img',$page)).addClass('disabled');
            }
            $page.data('count',pager.pageCount);
        }
  
        var appendData = function (data) {
    		//清空数据
        	if(!we.utils.isEmpty(options.items)){
        		var $items = $(options.items,$list),
        			it = $items.last(),
        			last = it.next();
        		$items.remove();
        		if(typeof data=='string'){
            		if(last.size()>0){
                        $(last).before(data);
            		}else{
        				$list.append(data);
            		}
            	}else{
            		if(last.size()>0){
            			$.each(data.list, function (index, row) {
                            $(last).before(row);
                        });
            		}else{
            			$.each(data.list, function (index, row) {
                            $list.append(row);
                        });
            		}
            	}
        		
            }else{
            	if(options.style=='2'){
            		//TODO
            	}else{
            		if($(options.page,$list).size()>0){
            			$list.children().not($page[0]).remove();
            		}else{
            			$list.empty();
            		}
            	}
            	if(typeof data=='string'){
            		$list.append(data);
            	}else{
            		$.each(data.list, function (index, row) {
            			$list.append(row);
            		});
            	}
            }
            
        	if(!we.utils.isEmpty(options.update) && $.isFunction(options.update))options.update.call(this,data);
            /*if(!p_created || $page.data('count')!=data.pager.pageCount) creatPage(data.pager);*/
        	if(!p_created) creatPage(options);
            if(options.min){
            	if($page.siblings('.vkoPag-min').size()<1){
        			$page.hide();
        			$page.before([
						'<div class="vkoPag-min">',
						'<a class="vkoPag-prev disabled" href="javascript:;" title="上一页"></a>',
						'<a class="vkoPag-next disabled" href="javascript:;" title="下一页"></a>',
						'</div>'
		              ].join(''));
        		}
            	var $min = $page.siblings('.vkoPag-min');
            	if (!we.utils.isEmpty($page.html())) {
					//上一页
					if ($page.find('li:first').children('a').size() < 1) {
						$('.vkoPag-prev',$min).unbind().addClass('disabled');
					} else {
						$('.vkoPag-prev',$min).unbind().bind('click', function () {
							$('.vkoPag-current',$page).parent().prev().children('a').click();
						}).removeClass('disabled');
					}
					//下一页
					if ($page.find('li:last').children('a').size() < 1) {
						$('.vkoPag-next',$min).unbind().addClass('disabled');
					} else {
						$('.vkoPag-next',$min).unbind().bind('click', function () {
							$('.vkoPag-current',$page).parent().next().children('a').click();
						}).removeClass('disabled');
					}
				} else {
					$('.vkoPag-prev',$min).addClass('disabled');
					$('.vkoPag-next',$min).addClass('disabled');
				}
            }
            if(!we.utils.isEmpty(options.success))options.success.call();
        }
     

        options.appendData = appendData;
       
        if(!firstpage && !p_created){
        	var pager={
        			pageSize:options.size,
        			recordCount:$page.attr('recordCount')?$page.attr('recordCount'):options.count
        	}
        	if(!pager.recordCount)return;
        	pager.pageCount = Math.ceil(pager.recordCount / pager.pageSize);
        	pager.pageNumber = $page.attr('pageNumber')?$page.attr('pageNumber'):1;
        	creatPage(pager);
        	firstpage = true;
        }else{
        	getPageData(options);
        }
  
        
    }
    
    var ajaxPageP = function (options) {
    	options.ajaxp = true;
    	ajaxPage(options);
    }

    return {
    	ajaxPage: ajaxPage
    }
});