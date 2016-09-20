/**
 * 小孩走路，提供小孩走路的接口给外部
 */
// 动画结束事件
    var animationEnd = (function() {
        var explorer = navigator.userAgent;
        if (~explorer.indexOf('WebKit')) {
            return 'webkitAnimationEnd';
        }
        return 'animationend';
    })();
function BoyWalk() {

	var container = $("#content");
	var swipe = new Swipe(container);
	var visualWidth = container.width();
	var visualHeight = container.height();

	function getValue(classname) {
		var $elem = $('' + classname);
		//返回走路的路线坐标
		return {
			height : $elem.height(),
			top : $elem.position().top
		}
	}
	//路的Y轴
	var pathY = function() {

		var data = getValue('.a_background_middle');
		return data.top + data.height / 2;
	}();

	var $boy = $("#boy");
	var boyHeight = $boy.height();
	$('#boy').css({
		top : pathY - boyHeight + 25//为什么要+25的偏移量呢
	});
	// 
	function pauseWalk(){
		$boy.addClass('pauseWalk');
	}
	//恢复走路的动作
	function restoreWalk() {
		$boy.removeClass('pauseWalk');
	}
	//css3控制动作变化
	function slowWalk() {
		$boy.addClass('slowWalk');
	}
	//计算距离
	function calculateDist(direction, proportion) {
		return (direction == "x" ? visualWidth : visualHeight) * proportion;
	}
	//人物移动效果
	function startRun(options, runTime) {
		var dfdPlay = $.Deferred();
		restoreWalk();
		//    	dfdPlay.done(function(){
		//    		$boy.css({
		//        		'left': options.left,
		//        		'top': options.top,
		//    			'-moz-transition': runTime,
		//    			'-webkit-transition': runTime,
		//    			'-o-transition': runTime,
		//    			'transition': runTime,
		//        	});
		//    	})
		//    	
		//    	dfdPlay.resolve(); // 动画完成

		$boy.transition(options, runTime, 'linear', function() {
			dfdPlay.resolve(); // 动画完成
		});

		return dfdPlay;
	}
	//开始走路
	function walkRun(time, dist, distY) {
		time = time || 3000;
		//脚动作
		slowWalk();
		//人物开始移动走路
		var d1 = startRun({
			'left' : dist + 'px',
			'top' : distY ? (distY + 'px') : undefined
		}, time);
		return d1;
	}

	function walkToShop(runTime) {
		var defer = $.Deferred();
		var doorObj = $('.door');
		//门的坐标
		var offsetDoor = doorObj.offset();//offset是针对document文档的
		var doorOffsetLeft = offsetDoor.left;
		//小男孩的坐标
		var offsetBoy = $boy.offset();
		var boyOffetLeft = offsetBoy.left;

		//当前需要移动的距离
		var instanceX = (doorOffsetLeft + doorObj.width() / 2)
				- (boyOffetLeft + $boy.width() / 2);
		var walkPlay = startRun({
			transform : 'translateX(' + instanceX + 'px), scale(0.3, 0.3)',
			opcity : 0.1
		}, 2000);
		walkPlay.done(function() {
			$boy.css({
				opacity : 0,
			})
			defer.resolve();
		});
		return defer;
	}
	


	var instanceX;
function walkOutShop(runTime){
var defer = $.Deferred();
restoreWalk();
var walkPlay = startRun({
	transform: 'scale(1,1)',
    opacity: 1
    }, runTime);
    //走路完毕
    walkPlay.done(function() {
    defer.resolve();
    });
    return defer; 
}
//取花
function takeFlower(){
	//设置取花时间为1s
	var defer = $.Deferred();
	setTimeout(function(){
		$boy.addClass('slowFlowerWalk');
		defer.resolve();
	}, 1000);
	return defer;
}
//修正女孩位置
var bridgeY = (function(){
	var data = getValue('.c_background_middle');
	return data.top;
})();
var girl = {
		elem : $('.girl'),
		getHeight: function(){
			return this.elem.height();
		},
		setOffset: function(){
			this.elem.css({
				left: visualWidth / 2,
				top:bridgeY - this.getHeight()
			})
		},
		getOffset : function(){
			return this.elem.offset();//jquery的方法，返回在document文档中的位置，返回的是top和left
		},
		getWidth: function(){
			return this.elem.width();
		},
		// 转身动作
        rotate: function() {
            this.elem.addClass('girl-rotate')}
	}
girl.setOffset();


return {
	//开始走路
	/**
	 * 时间，x比例，y比例
	 */
	walkTo : function(time, proportionX, proportionY) {
		var distX = calculateDist('x', proportionX);
		var distY = calculateDist('y', proportionY);
		return walkRun(time, distX, distY);
	},
	stopWalk : function() {
		pauseWalk();
	},
	setColoer : function(value) {
		$boy.css('background-color', value)
	},
	//走进商店
	toShop : function() {
		return walkToShop.apply(null, arguments);
	},
	//走出商店
	outShop : function() {
		return walkOutShop.apply(null, arguments);
	},
	//取花
	takeFlower : function(){
		return takeFlower();
	},
	restore : function(){
		this.stopWalk();
		$boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
	},
	rotate : function(callback){
		 restoreWalk();
         $boy.addClass('boy-rotate');
         // 监听转身完毕?????
         if(callback){
        	 $boy.on(animationEnd, function() {
                 callback();
                 $(this).off();
             }) 
         }
	},
	girl : girl
}

}