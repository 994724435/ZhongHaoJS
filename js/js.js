function toMain(html){
	$.ajax({
		type:'GET',
		url:'./'+html+'.php',
		async:true,
		success:function(response,status,xhr){
			$('.main').html(response);
			$('.main').finish().fadeIn();
			$('.section .'+html).fadeOut();
			$('.into').hide();
			$('.line').hide();
			$.fn.fullpage.setAllowScrolling(false,'all');
			
			//ajax请求已成功对相应页面进行操作
			if($(response).attr('class').indexOf('about_main') > -1){		//关于中昊
				//让内容初始垂直居中
				resize(function(){
					$('.about_main .side').width(parseInt(($(window).width()-$('.about_main ul').width())/2));
					$('.about_main ul .main_li').each(function(i,e){
						$(e)[0].default_padding_top = parseInt(($(e).height()-$(e).children('.wrap').height())/2);	//先把每个目录的默认paddingTop值保存起来
						$(e).css('paddingTop',$(e)[0].default_padding_top);
					});
				});
				//每个目录的点击事件
				$('.about_main .main_li').click(function(){
					if($(this).find('.content').is(':visible')){return false};
					//先隐藏同级目录
					$(this).siblings().css({width:20,paddingTop:$(this)[0].default_padding_top,backgroundColor:'rgba(255, 255, 255, 0.2)'});
					$(this).siblings().find('.content').css({width:0,height:0,opacity:0});
					$(this).siblings().find('.content').hide();
					
					if($('.about_main ul').width() - 350 != 460){
						$('.about_main .side').width(parseInt(($(window).width()-810)/2));
					};
					//再显示点击目录下的内容
					var new_padding_top = parseInt(($(window).height()-473)/2);	//计算新的paddingTop值					
					$(this).find('.content').show();
					$(this).css({width:480,paddingTop:new_padding_top,backgroundColor:'rgba(255, 255, 255, 0)'});
					$(this).find('.content').css({width:480,height:450,opacity:1});
					//自定义滚动条
					$(this).find('.content').scrollInit();
				});
				
				//点击左右两侧空白隐藏所有目录
				$('.about_main .side').click(function(){
					$('.about_main .side').width(parseInt(($(window).width()-350)/2));
					$('.about_main .main_li').css({width:20,paddingTop:$('.about_main .main_li')[0].default_padding_top,backgroundColor:'rgba(255, 255, 255, 0.2)'});
					$('.about_main .main_li').find('.content').css({width:0,height:0,opacity:0});
					$('.about_main .main_li').find('.content').hide();
				});
			}else if($(response).attr('class').indexOf('news_main') > -1){			//中昊新闻
				resize(function(){
					//初始化菱形块的角度并可以根据窗口分辨率自动调节
					var angle = Math.acos($(window).width()/Math.sqrt(Math.pow($(window).width(),2)+Math.pow($(window).height(),2)))/Math.PI*180-1.55;
					$('.news_main .show_content .scroll_content .block,.news_main .polygon').css({
						transform:'skew(0,-'+angle+'deg)',
						MsTransform:'skew(0,-'+angle+'deg)',
						WebkitTransform:'skew(0,-'+angle+'deg)'
					});
					$('.news_main .show_content .scroll_content .block.lb img,.news_main .show_content .scroll_content .block.rt img,.news_main .show_content .scroll_content .block p').css({
						transform:"skew(0,"+angle+"deg)",
						MsTransform:"skew(0,"+angle+"deg)",
						WebkitTransform:"skew(0,"+angle+"deg)"
					});
					//初始化滑动容器的Left值并可以根据窗口分辨率自动调节
					$('.news_main .show_content .scroll_content').each(function(i,e){
						$(e).css('left',i*$(e).width());
					});
				});
				
				//点击左右箭头滑动内容
				$('.news_main > a').click(function(){
					if($(this).attr('class').indexOf('prev') > -1){
						if($('.news_main .show_content .scroll_content:eq(0)').position().left < 0){
							$('.news_main .show_content .scroll_content').each(function(i,e){
								$(e).animate({left:$(e).position().left+$(e).width()},1000,'easeInOutQuint');
							});
						}else{
							return false;
						};
					}else if($(this).attr('class').indexOf('next') > -1){
						if($('.news_main .show_content .scroll_content').last().position().left > 0){
							$('.news_main .show_content .scroll_content').each(function(i,e){
								$(e).animate({left:$(e).position().left-$(e).width()},1000,'easeInOutQuint');
							});
						}else{
							return false;
						};
					};
				});
				
				//ajax导入中昊新闻页详情
				$('.news_main .show_content .scroll_content .child').click(function(){
					$.ajax({
						type:"get",
						url:"./news_and_join.child.php",
						async:true,
						success:function(response,status,xhr){
							$('.news_and_join_detail_door').animate({left:'0%',width:'100%'},388,'linear',function(){
								$('.news_and_join_detail_door').fadeOut(function(){
									$('.news_and_join_detail_door').css({left:'49%',width:'2%'});
								});
								$('.news_and_join_child_bg').finish().fadeIn();
								$('.news_and_join_child_bg .child_wrap').finish().fadeIn();
								$('.news_and_join_child_bg .child_wrap .content').html(response);
								$('.news_child').scrollInit();
							});
							$('.news_and_join_detail_door').show();
							$('.child_wrap > a').click(function(){
								$('.news_and_join_child_bg .child_wrap').hide();
								$('.news_and_join_child_bg').animate({width:'2%',left:'49%'},388,'linear',function(){
									$('.news_and_join_child_bg').hide();
									$('.news_and_join_child_bg').css({left:0,width:'100%'});
								});
							});
						},
						error:function(){
							alert('加载失败,请重试!');
						}
					});
				});
			}else if($(response).attr('class').indexOf('project_main') > -1){			//中昊项目
				$('.project_nav').width($('.project_nav li').outerWidth(true)*$('.project_nav li').length);
				for(var i = 0; i < $('.project_nav li').length; i++){
					var n =$('.project_nav li').eq(i).attr('data-class');
					$('.project_main .bgs').append("<div style='background-image:url(./images/pbg"+n+".jpg)'></div>");
				};
				$('.project_main .bgs').show();
				$('.project_main').mousemove(function(e){
					var x = $(window).width()-e.pageX <= 1? $(window).width(): e.pageX;
					$('.project_nav').css('left',-(x/$(window).width())*($('.project_nav').width()-$(window).width()));
				});
				$('.project_nav li').mouseenter(function(){
					$('.project_main .bgs div').eq($(this).index()).finish().fadeIn().siblings().fadeOut();
				});
				$('.project_main .close_project').click(backTo);
				$('.project_nav li').click(function(){
					var li = $(this);
					$.ajax({
						type:"get",
						url:"./inner_project_menu.php",
						async:true,
						success:function(response,status,xhr){
							$('.inner_project_menu').html(response);
							var startLeft = li.offset().left;
							$('.inner_project_bg').finish().fadeIn(function(){
								$('.inner_project_menu').css('left',startLeft);
								$('.inner_project_menu').finish().fadeIn(function(){
									$('.inner_project_menu').animate({left:'50%',marginLeft:-$('.inner_project_menu').width()/2},188,'linear',function(){
										$('.inner_project_menu').animate({width:'100%',marginLeft:-$(window).width()/2},388,'linear',function(){
											$('.inner_project_bg').fadeOut(388);
											$('.inner_project_menu').css('backgroundColor','#fff');
										});
									});
								});
							});
							$('.project_menu ul').width($('.project_menu ul li').outerWidth(true)*$('.project_menu ul li').length);
							$('.project_menu ul li').each(function(i,e){
								if(i % 2 == 0){
									$(e).css('backgroundColor','#ccc');
								};
								$(e).mouseenter(function(){
									$(this).children('p').css('color','#fff');
									$(this).siblings().children('p').css('color','#000');
									$(this).children('img').finish().fadeIn().parent().siblings().children('img').fadeOut();
								});
							});
							$('.project_menu').mousemove(function(e){
								var x = $(window).width()-e.pageX <= 1? $(window).width(): e.pageX;
								$('.project_menu ul').css('left',-(x/$(window).width())*($('.project_menu ul').width()-$(window).width()));
							});
							$('.project_menu > a').click(function(){
								$('.inner_project_menu').children().remove();
								$('.inner_project_menu').animate({width:240,marginLeft:-120},388,'linear',function(){
									setTimeout(function(){
										$('.inner_project_menu').animate({left:startLeft,marginLeft:0},388,'linear',function(){
											$('.inner_project_menu').fadeOut();
										});
									},420);
								});
							});
							$('.project_menu ul li').click(function(){
								var project = $(this).index();
								var project_last_index = $('.project_menu ul li').length-1;
								(function ajax(){
									$.ajax({
										type:"get",
										url:"./inner_project_detail.php",
										async:true,
										success:function(response,status,xhr){
											var detail_li_startLeft = $('.project_menu ul li').eq(project).offset().left;
											$('.inner_project_bg').finish().fadeIn(function(){
												$('.inner_project_detail').css('left',detail_li_startLeft);
												$('.inner_project_detail').finish().fadeIn(function(){
													$('.inner_project_detail').animate({left:'50%',marginLeft:-$('.inner_project_detail').width()/2},188,'linear',function(){
														$('.inner_project_detail').animate({width:'100%',marginLeft:-$(window).width()/2},388,'linear',function(){
															$('.inner_project_bg').fadeOut(388);
															$('.inner_project_detail').html(response);
															for(var i = 0; i < $('.project_detail .control .pic_nav .pic_wrap ul li').length; i++){
																$('.project_detail .bigBg').append("<div class='bg' style='background-image:url("+$('.project_detail .control .pic_nav .pic_wrap ul li').eq(i).children('img').attr('src')+")'></div>");
															};
															$('.project_detail .control .pic_nav .pic_wrap ul').width($('.project_detail .control .pic_nav .pic_wrap ul li').outerWidth(true)*$('.project_detail .control .pic_nav .pic_wrap ul li').length);
															var bigBg = 0;
															$('.project_detail .control .pic_nav .pic_wrap ul li').click(function(){
																bigBg = $(this).index();
																$(this).addClass('on').siblings().removeClass('on');
																$('.project_detail .bigBg .bg').eq(bigBg).finish().fadeIn().siblings().fadeOut();
															});
															$('.project_detail .control .pic_nav > a').click(function(){
																if($(this).attr('class').indexOf('prev') > -1){
																	bigBg > 0? bigBg--: bigBg = $('.project_detail .control .pic_nav .pic_wrap ul li').length-1;
																	$('.project_detail .control .pic_nav .pic_wrap ul li').eq(bigBg).addClass('on').siblings().removeClass('on');
																	$('.project_detail .bigBg .bg').eq(bigBg).finish().fadeIn().siblings().fadeOut();
																}else{
																	bigBg < $('.project_detail .control .pic_nav .pic_wrap ul li').length-1? bigBg++: bigBg=0;
																	$('.project_detail .control .pic_nav .pic_wrap ul li').eq(bigBg).addClass('on').siblings().removeClass('on');
																	$('.project_detail .bigBg .bg').eq(bigBg).finish().fadeIn().siblings().fadeOut();
																};
																if(bigBg <= 2){
																	$('.project_detail .control .pic_nav .pic_wrap ul').animate({left:0},188);
																}else if(bigBg >= $('.project_detail .control .pic_nav .pic_wrap ul li').length-3){
																	$('.project_detail .control .pic_nav .pic_wrap ul').animate({left:-$('.project_detail .control .pic_nav .pic_wrap ul li').length-5*$('.project_detail .control .pic_nav .pic_wrap ul li').outerWidth(true)},188);
																}else{
																	$('.project_detail .control .pic_nav .pic_wrap ul').animate({left:-(bigBg-2)*$('.project_detail .control .pic_nav .pic_wrap ul li').outerWidth(true)},188);
																};
															});
															$('.project_detail .close').click(function(){
																$('.inner_project_detail').children().remove();
																$('.inner_project_detail').animate({width:240,marginLeft:-120},388,'linear',function(){
																	setTimeout(function(){
																		$('.inner_project_detail').animate({left:detail_li_startLeft,marginLeft:0},388,'linear',function(){
																			$('.inner_project_detail').fadeOut();
																		});
																	},420);
																});
															});
															$('.project_detail .project_info,.project_detail .project_info_block > a').click(function(){
																if(Math.abs(parseFloat($('.project_detail .project_info_block').css('right'))) == $('.project_detail .project_info_block').outerWidth(true)){
																	$('.project_detail .project_info_block > a').css('backgroundPosition','-72px center');
																	$('.project_detail .project_info_block').animate({right:0},188,function(){
																		$('.project_detail .project_info_block > a').css('backgroundPosition','-36px center');
																	});
																}else{																
																	$('.project_detail .project_info_block > a').css('backgroundPosition','36px center');
																	$('.project_detail .project_info_block').animate({right:-$('.project_detail .project_info_block').outerWidth(true)},188,function(){
																		$('.project_detail .project_info_block > a').css('backgroundPosition','0 center');
																	});
																};
															});
															$('.project_detail .control > a').click(function(){
																if($(this).attr('class').indexOf('project_in_left') > -1){
																	if(project <= 0){return false};
																	project--;
																}else if($(this).attr('class').indexOf('project_in_right') > -1){
																	if(project >= project_last_index){return false};
																	project++;
																};
																$('.inner_project_detail').children().remove();
																$('.inner_project_detail').animate({width:240,marginLeft:-120},388,'linear',function(){
																	setTimeout(function(){
																		$('.inner_project_detail').animate({left:detail_li_startLeft,marginLeft:0},388,'linear',function(){
																			ajax();
																		});
																	},420);
																});
															});
														});
													});
												});
											});
										},
										error:function(){
											alert('加载失败,请重试!');
										}
									});
								})();
							});
						},
						error:function(){
							alert('加载失败,请重试!');
						}
					});
				});
			}else if($(response).attr('class').indexOf('join_main') > -1){
				resize(function(){
					var wh = $(window).width()/4.3;
					var c = Math.sqrt(Math.pow(wh,2)*2);
					var l = ((c*5-$(window).width())/2)-((c-wh)/2);
					$('.join_main .block').each(function(i,e){
						$(e).css({width:wh,height:wh,marginTop:-wh/2,left:i*c-l});
						$(e).children('.child_block').each(function(i2,e2){
							$(e2).css({width:wh/2,height:wh/2});
							if(i2 % 2 == 0){
								$(e2).css('backgroundColor','#dddddd');
							}else{
								$(e2).css('backgroundColor','#a0a0a0');
							};
						});
					});
					$('.join_main .block .tl').css({top:-wh/2,left:0});
					$('.join_main .block .tr').css({top:-wh/2,right:0});
					$('.join_main .block .rt').css({top:0,right:-wh/2});
					$('.join_main .block .rb').css({bottom:0,right:-wh/2});
					$('.join_main .block .br').css({bottom:-wh/2,right:0});
					$('.join_main .block .bl').css({bottom:-wh/2,left:0});
					$('.join_main .block .lb').css({bottom:0,left:-wh/2});
					$('.join_main .block .lt').css({top:0,left:-wh/2});
					$('.join_main .block .jbr').css({bottom:-wh/2,right:-wh/2});
					$('.join_main .block .jlt').css({top:-wh/2,left:-wh/2});
				});
				$('.join_main .block .btn').click(function(){
					$.ajax({
						type:"get",
						url:"./news_and_join.child.php",
						async:true,
						success:function(response,status,xhr){
							$('.news_and_join_detail_door').animate({left:'0%',width:'100%'},388,'linear',function(){
								$('.news_and_join_detail_door').fadeOut(function(){
									$('.news_and_join_detail_door').css({left:'49%',width:'2%'});
								});
								$('.news_and_join_child_bg').finish().fadeIn();
								$('.news_and_join_child_bg .child_wrap').finish().fadeIn();
								$('.news_and_join_child_bg .child_wrap .content').html(response);
								$('.news_child').scrollInit();
							});
							$('.news_and_join_detail_door').show();
							$('.child_wrap > a').click(function(){
								$('.news_and_join_child_bg .child_wrap').hide();
								$('.news_and_join_child_bg').animate({width:'2%',left:'49%'},388,'linear',function(){
									$('.news_and_join_child_bg').hide();
									$('.news_and_join_child_bg').css({left:0,width:'100%'});
								});
							});
						},
						error:function(){
							alert('加载失败,请重试!');
						}
					});
				});
			};
		},
		error:function(x,y,t){
			alert('加载失败,请重试!'+y+','+t);
		}
	});
};
function resize(fn){
	fn();
	$(window).resize(fn);
};
function backTo(){
	if($('#map').is(':visible')){
		$('#map').fadeOut();
	};	
	$('.main').fadeOut();
	$('.main').children().remove();
	$('.line').show();
	$('.section').children().children('.page').finish().fadeIn();
	$('.into').show();
	$('.news_and_join_child_bg .child_wrap .content').children().remove();
	$.fn.fullpage.setAllowScrolling(true,'all');
};
function showMap(){
	$('#map').finish().fadeIn();
	ShowMap("map",{city:'重庆市',addr:'重庆市渝北区新南路龙湖MOCO4栋18楼',title:'中昊设计',lawfirm:'中昊设计',tel:'023-67602282\n023-67602292',pic:'./images/logo.png'});
	$.fn.fullpage.setAllowScrolling(false,'all');
	$('.section7').click(function(){
		$('#map').fadeOut();
		$.fn.fullpage.setAllowScrolling(true,'all');
	});
};
//自定义滚动条方法开始
$.fn.scrollInit = function(){
	var o = $(this);
	o.a = o.find('.scrollArea');
	o.b = o.find('.scrollBar');
	o.bb = o.b.find('.scrollBar_block');
	o.cursor_len = 0;		//当鼠标点击滑块的时候，鼠标距离滑块顶部的距离
	o.bb_top = 0;		//被鼠标拖动的滑块的top值
	o.s = false;		//当鼠标在滑块上点击后才能拖动，状态控制
	o.aTop = '';		//滚动内容显示
	if(o.a.height() <= o.height()){
		o.b.hide();
	}else{
		o.bb.css('height',o.height()/o.a.height()*100+'%');
		o.bb.mousedown(function(e){
			o.cursor_len = e.pageY-o.bb.offset().top;
			o.s = true;
			return false;
		});
		$(document).mouseup(function(){
			o.s = false;
			return false;
		});
		$(document).mousemove(function(e){
			if(o.s){
				o.bb_top = e.pageY - o.b.offset().top - o.cursor_len;
				if(o.bb_top > o.b.height()-o.bb.outerHeight(true)){
					o.bb_top = o.b.height()-o.bb.outerHeight(true);
				}else if(o.bb_top < 0){
					o.bb_top = 0;
				};
				o.aTop = -(o.a.height()-o.height())*(o.bb_top/(o.b.height()-o.bb.outerHeight(true)));
				o.bb.css('top',o.bb_top);
				o.a.css('top',o.aTop);
			}else{
				return false;
			};
		});
		$(window).on('mousewheel DOMMouseScroll',function(e){
			var delta=(e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
							(e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));    // firefox
			if(delta<0){
				o.bb_top+20 < o.b.height()-o.bb.outerHeight(true)? o.bb_top+=20: o.bb_top=o.b.height()-o.bb.outerHeight(true);
			}else if(delta>0){
				o.bb_top-20 > 0? o.bb_top-=20: o.bb_top=0;
			};
			o.aTop = -(o.a.height()-o.height())*(o.bb_top/(o.b.height()-o.bb.outerHeight(true)));
			o.bb.css('top',o.bb_top);
			o.a.css('top',o.aTop);
		});
	};
};
//自定义滚动条方法结束

$(function(){
	var section6_g_line = parseInt(Math.sqrt(Math.pow($(window).width()/4,2)*2));
	$('.line14,.line15,.line16,.line17').css('top',parseInt(($(window).height()-$(window).width()/4)/2));
	$('.line18,.line19,.line20,.line21').css('bottom',parseInt(($(window).height()-$(window).width()/4)/2));
	$(window).resize(function(){
		section6_g_line = parseInt(Math.sqrt(Math.pow($(window).width()/4,2)*2));
		$('.line14,.line15,.line16,.line17').css('top',parseInt(($(window).height()-$(window).width()/4)/2));
		$('.line18,.line19,.line20,.line21').css('bottom',parseInt(($(window).height()-$(window).width()/4)/2));
	});
	var curPage = 1;		//记录当前页码
	var inner_page = false;		//进入内页开关
	var show_map = false;		//控制地图显示开关
	$('.nav li').click(function(){
		var i = $(this).attr('data-i');
		if(i){
			if(i == curPage){
				return false;
			}else{
				backTo();
				$.fn.fullpage.moveTo(i);
				if(i == 2 || i == 3 || i == 4 || i==5 || i == 6){
					inner_page = true;
				}else if(i == 7){
					show_map = true;
				};
			};
		}else{
			backTo();
		};
	});
	$('.toTop').click(function(){
		$.fn.fullpage.moveTo(1);
	});
	
	var waitOn = 0;
	var waitTimer = null;
	$(document).ajaxStart(function(){
		$('.opacity_bg').finish().fadeIn();
		$('.wait').finish().fadeIn();
		
		//ajax等待动画
		waitTimer = setInterval(function(){
			waitOn < $('.wait li').length-1? waitOn++: waitOn=0;
			$('.wait li:eq('+waitOn+')').addClass('on').siblings().removeClass('on');
		},80);
	});
	$(document).ajaxStop(function(){
		$('.opacity_bg').fadeOut();
		$('.wait').fadeOut();
		clearInterval(waitTimer);
	});
	
	//ajax等待圈的小圆点环形定位
	$('.wait li').each(function(i,e){
		var gap = 360/$('.wait li').length;
		var radius = $('.wait').width()/2;
		var eAngle = gap*i*(Math.PI/180);
		var x = radius+radius*Math.cos(eAngle);
		var y = radius+radius*Math.sin(eAngle);
		$(e).css({left:x,top:y});
	});
	
	$('.help > a').click(function(){
		$('.help').fadeOut();
	});
	
	//fullpage配置
	$('#main').fullpage({
		keyboardScrolling: false,
		css3: true,
		resize: true,
		easing: 'easeInSine',
		scrollingSpeed: 2000,
		recordHistory: false,
		afterLoad: function(a,i){
			if(i === curPage){
				$('.nav li:eq('+(i-1)+')').addClass('active').siblings().removeClass('active');
				if(inner_page && i == curPage){
					var page_name = $('.section'+i).find('.page').attr('class').replace(' page','');
					toMain(page_name);
					inner_page = false;
				}else if(show_map){
					showMap();
					show_map = false;
				};
			};
		},
		onLeave: function(i,n,d){
			curPage = n;
			$('.section'+i).css('backgroundPosition','50% 100%');
			$('.section'+n).css('backgroundPosition','50% 0%');
			switch(i){
				case 2: {
					$('.line1,.line2,.line3,.line4,.line5,.line6').removeAttr('style');
					break;
				};
				case 3: {
					$('.line1,.line2,.line3,.line4,.line5,.line6').removeAttr('style');
					if(d == 'down'){
						$('.line7,.line8,.line9,.line10').css({width:3000,opacity:0});
					}else{
						$('.line7,.line8,.line9,.line10').css({width:0,opacity:0});
					};
					break;
				};
				case 4: {
					$('.line1,.line2,.line3,.line4,.line5,.line6').removeAttr('style');
					break;
				};
				case 5: {
					$('.line1,.line2,.line3,.line4,.line5,.line6').removeAttr('style');
					if(d == 'down'){
						$('.line11,.line12,.line13').css('opacity',0);
					}else{
						$('.line11,.line12,.line13').css('left','-100%');
					};
					break;
				};
				case 6: {
					$('.line1,.line2,.line3,.line4,.line5,.line6').removeAttr('style');
					if(d == 'down'){
						$('.line14,.line15,.line18,.line19,.line16,.line17,.line20,.line21').css('opacity',0);
					}else{
						$('.line14,.line15,.line18,.line19').css({width:20,marginLeft:-20,opacity:0});
						$('.line16,.line17,.line20,.line21').css({width:20,marginRight:-20,opacity:0});
					};
					break;
				};
				case 7: {
					$('.line5,.line6').css('opacity',1);
					break;
				};
			};
			if(d == 'down'){
				switch(n){
					case 3: {
						$('.line1,.line2,.line3,.line4,.line5,.line6').css('transition','all 1.5s 0.5s ease-in-out');
						$('.line7,.line8,.line9,.line10').css('transition','all 2s 0.5s ease-in-out');
						break;
					};
					case 4: {
						$('.line').css('transition','all 1.5s 0.5s ease-in-out');
						break;
					};
					case 5: {
						$('.line').css('transition','all 1.5s 0.5s ease-in-out');
						break;
					};
					case 6: {
						$('.line').css('transition','all 1s ease-in-out');
						$('.line14,.line15,.line18,.line19,.line16,.line17,.line20,.line21').css('transition','all 1s 1s ease-in-out');
						break;
					};
					default: {
						$('.line').css('transition','all 2s ease-in-out');
						break;
					};
				};
			}else{
				switch(i){
					case 1: {
						$('.line').removeAttr('style');
						break;
					};
					case 5: {
						$('.line').css('transition','all 2s ease-in-out');
						$('.line11,.line12,.line13').css('transition','all 2s 1s ease-in-out');
						break;
					};
					default: {
						$('.line').css('transition','all 2s ease-in-out');
						break;
					};
				};
			};
			switch(n){
				case 1: {
					$('.line').css('backgroundColor','#ccc');
					$('.line1').css('left','-80%');
					$('.line2').css('left','180%');
					$('.line3').css('left','-50%');
					$('.line4').css('left','150%');
					$('.line5').css('left','-20%');
					$('.line6').css('left','120%');
					break;
				};
				case 2: {
					$('.line').css('backgroundColor','#888');
					$('.line1').css('left','40%');
					$('.line2').css('left','60%');
					$('.line3').css('left','44%');
					$('.line4').css('left','56%');
					$('.line5').css('left','48%');
					$('.line6').css('left','52%');
					break;
				};
				case 3: {
					$('.line').css('backgroundColor','#fff');
					$('.line1').css('left','-5%');
					$('.line2').css('left','105%');
					$('.line3').css('left','20%');
					$('.line4').css('left','80%');
					$('.line5').css('left','40%');
					$('.line6').css('left','60%');
					$('.line7,.line8,.line9,.line10').css({width:3000,opacity:1});
					break;
				};
				case 4: {
					$('.line').css('backgroundColor','#ccc');
					$('.line1').css('left','14%');
					$('.line2').css('left','86%');
					$('.line3').css('left','28.5%');
					$('.line4').css('left','71.5%');
					$('.line5').css('left','43%');
					$('.line6').css('left','57%');
					break;
				};
				case 5: {
					$('.line').css('backgroundColor','#fff');
					$('.line1,.line3').css('left','20%');
					$('.line5,.line6').css('left','50%');
					$('.line2,.line4').css('left','80%');
					$('.line11,.line12,.line13').css({left:0,opacity:1});
					break;
				};
				case 6: {
					$('.line1,.line3').css('left','25%');
					$('.line5,.line6').css('left','50%');
					$('.line2,.line4').css('left','75%');
					$('.line14,.line15,.line18,.line19').css({width:section6_g_line,marginLeft:-section6_g_line,opacity:1});
					$('.line16,.line17,.line20,.line21').css({width:section6_g_line,marginRight:-section6_g_line,opacity:1});
					break;
				};
				case 7: {
					$('.line').css('backgroundColor','#ccc');
					$('.line1,.line3').css('left','-5%');
					$('.line2,.line4').css('left','105%');
					$('.line5,.line6').css({left:'50%',opacity:'0'});
					$('.line14,.line15,.line18,.line19,.line16,.line17,.line20,.line21').css('opacity',0);
					break;
				};
			};
		}
	});
	
	//检测IE8以下，关闭页面滚动
	if(!$.support.opacity){
		$.fn.fullpage.setAllowScrolling(false,'all');
	};
});