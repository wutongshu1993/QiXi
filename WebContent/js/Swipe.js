/**
 *页面滑动 
 * 
 */

function Swipe(container){
//	var container = $("#content");
	var element = container.find(":first");
	//var slides = container.find("li");
	var slides = element.find(">");
	var width = container.width();
	var height = container.height();
	//滑动对象
	var swipe = {};
	
	element.css({
        width  : (slides.length * width) + 'px',
        height : height + 'px'
    });
	//设置每一个li的宽高
	$.each(slides, function(index){
		var slide = slides.eq(index); //获取到每一个li元素
		slide.css({
			width: width +'px',
			height: height +'px'
		});
	});
	/**
	 * 移动距离和速度
	 */
	swipe.scrollTo = function (x, speed){
		element.css({
			'transition-timing-function': 'linear',
			'transition-duration': speed+'ms',
			'transform':  'translate3d(-' + x + 'px,0px,0px)'
		});
		return this;
	}
	return swipe;
}
