var hostName = "";
$.fn.extend({
	lightbox:function (player) {
		var imgList = this;
		var index;
		var lb = new lbobj({
		})
		var startPosition, endPosition, moveLength;
	    $(document).on('touchstart',"#showImage",function(e){  
	    	document.addEventListener('touchmove',lb.bodyScroll, false);
	        var touch =  e.originalEvent.targetTouches[0]; 
	        startPosition = {  
	            x: touch.pageX 
	        }
	    }) .on('touchmove', "#showImage",function(e){
	        var touch =  e.originalEvent.targetTouches[0]; 
	        endPosition = {  
	            x: touch.pageX
	        };
	        moveLength = endPosition.x - startPosition.x;
	    }) .on('touchend', "#showImage",function(e){  
	    
	        if (moveLength>38) {
				lb.changeImgFun(true);
			}
			if (moveLength<-38) {
				lb.changeImgFun(false);
			}
	    });
		this.click(function (e) {
			var src,
				target = $(e.target),
				loading = $(".loading");
			e.preventDefault();
			lb.imgList = target.parents(".slider_box").children("li").children(".lightbox");
            index = target.attr("index");
            src = target.attr("src");
            if(src.indexOf("?")>-1){
                src = src.split("?")[0];
            }
			if(player != null){
                if(!player.pause()){
                    player.pause();
                }
			}

            $(".lightboxOverlay").show(200);
            lb.initNum();
			lb.initImgSizeFun(src);
			lb.initControl(index);
			
		})
	}
})

var lbobj = function (option) {
	this.imgList = option.imgList||[];
	this.showControl = option.showControl || true;
	this.loading = false;
	this.index = 0;
	this.init();
}
lbobj.prototype = {
	init:function () {
		var self = this;
		var lightTpl = '<div class="outerWrap"></div> <div id="lightboxOverlay" class="lightboxOverlay" style="display:none;"><div id="lightbox" class="lb_wrap transition"><span class="loading" style="width:30px;height:30px;position:absolute;left:50%;margin-right:-13px;top:30px;z-index:9999;text-align:center;"><img src="'+hostName+'images/loading.png" class="loading_animation" style="width:25px;" /></span><span class="lb_close"><img src="'+hostName+'images/close.png" alt=""></span><div class="lg_controlBox"><span class="lb-prev lb-control"><img src="'+hostName+'images/left.png" alt=""></span><span class="lb-next lb-control"><img src="'+hostName+'images/right.png" alt=""></span></div><div class="lb_imgBox"><img src="http://d.233sy.cn/Uploads/20171114/dtws2.jpg" alt="" id="showImage" style="visibility:hidden"/><div class="numShow hide"><span id="currentNum"></span>/<span class="labelNum">'+this.labelNum+'</span></div></div></div></div>'
		$("body").append(lightTpl);
		$(".lb_close").on('click',function () {
                self.closeFun();
		})
		$(".lb-prev").on('click',function () {
			self.changeImgFun(true);
		})
		$(".lb-next").on('click',function () {
			self.changeImgFun(false);
		})
		
		$(document).keydown(function(event){ 
			if(event.keyCode == 37){ 
				self.changeImgFun(true);
			}else if (event.keyCode == 39){ 
				self.changeImgFun(false);
			} 
		}); 

	},
	initControl:function (index) {
		$("#currentNum").text(parseInt(index)+1);
		if(this.showControl == false){
			$(".lg_controlBox").hide();
		}else{
			this.index = index;
			if (index == 0) {
				$(".lb-prev").hide();
				$(".lb-next").show();
			}
			if (index == this.imgList.length-1) {
				$(".lb-next").hide();
				$(".lb-prev").show();
			}
			if (index < this.imgList.length-1 && index > 0) {
				$(".lb-prev").show();
				$(".lb-next").show();
				
			}

		}	

	},
	closeFun:function () {
		document.removeEventListener('touchmove',this.bodyScroll,false);  
		$("#lightboxOverlay").hide(200);
	},
	initNum:function () {
		$(".labelNum").text(this.imgList.length);
	},
	initImgSizeFun:function (src) {
		var realHeight,realWidth;
		var _h = $("body").height();
		var _w = $("body").width();
		var _pro = _w/_h;
		var self = this;
		$("#showImage").attr("src",src);
		
		$("#showImage").on("load",function() {
			$("#showImage").attr("style","");
            $("#showImage").css("visibility","visible");

			realWidth = $(this).width();
			realHeight = $(this).height();

			var pro = realWidth/realHeight;

			if(pro > _pro){
				if(realWidth>=_w){
					$(".lb_wrap").width($(".outerWrap").width()*90/100);
					$("#showImage").css("width","100%").css("height",$(".lb_wrap").width()/pro);
					setTimeout(function () {
	                    $(".lb_wrap").height($("#showImage").height());
	                },200)
				}
				else{//如果小于浏览器的宽度按照原尺寸显示
					
					$(".lb_wrap").height(realHeight);
					$(".lb_wrap").width(realWidth);
					$("#showImage").css("width",realWidth+'px').css("height",realHeight+'px');
					
				}
			}
			else if(pro <= _pro){
				if(realHeight>=_h){
					$(".lb_wrap").height($(".outerWrap").height()*80/100);
					$("#showImage").css("height","100%").css("width",$(".outerWrap").height()*80/100*pro);
					setTimeout(function () {
	                    $(".lb_wrap").width($("#showImage").width());
	                },200)
				}
				else{//如果小于浏览器的宽度按照原尺寸显示
					
					$(".lb_wrap").height(realHeight);
					$(".lb_wrap").width(realWidth);
					$("#showImage").css("width",realWidth+'px').css("height",realHeight+'px');
					
				}
			}
			
			
			$(".loading").hide();
			setTimeout(function (argument) {
				$(".lb_wrap").css({"margin-top":(_h-$("#showImage").height()-30)/2});
			},300)
            $(".numShow").removeClass("hide");
            self.loading =false;
            $("#showImage").off("load")
		});


		
	},
	bodyScroll:function (event){  
		//alert("sasasa");
	    event.preventDefault();  
	},  
	changeImgFun:function (isPrev) {
        if(this.loading == false) {
            this.loading =true;
            $(".loading").show();
            if (isPrev == true) {
                this.index--;
            } else {
                this.index++;
            }
            if (isPrev == true && this.index == -1) {
                this.index = 4;
            }
            if (isPrev == false && this.index == 5) {
                this.index = 0;
            }

            var src = $(this.imgList[this.index]).children("img").attr("src");
            if (src.indexOf("?") > -1) {
                src = src.split("?")[0];
            }

            this.initImgSizeFun(src);
            this.initControl(this.index);
        }
	}
}