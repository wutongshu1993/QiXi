/**
 * 
 */

window.onload = init;
function init(){
	var boy = BoyWalk();
	var girl = boy.girl;
	var container = $("#content");
	var swipe = new Swipe(container);
	var snow = new Snow(); 
	// 音乐配置
    var audioConfig = {
        enable: true, // 是否开启音乐
        playURL: 'music/happy.wav', // 正常播放地址
        cycleURL: 'music/circulation.wav' // 正常循环播放地址
    };
    function Html5Audio(url, isloop){
    	var audio = new Audio(url);
    	audio.autoPlay = true;
    	audio.loop = isloop || false;
    	audio.play();
    	return {
    		end : function(callback){
    			audio.addEventListener('ended',function(){
    				callback();
    			}, false);
    		}
    	}
    }
	/*var birdgeY = (function(){
		var data = getValue('.c_background_middle');
		return data.top;
	})();*/
	var visualHeight = container.height();
	var visualWidth = container.width();
	function scrollTo(time, proportionX) {
//        var d1;
		var distX = container.width() * proportionX;
        swipe.scrollTo(distX, time);
    }
	
	var bird = {
			elem: $('.bird'),
	fly: function(){
		this.elem.addClass('birdFly');
		this.elem.transition({right: container.width()}, 15000, 'linear');
	}
	}
	
	// 动画结束事件
    var animationEnd = (function() {
        var explorer = navigator.userAgent;
        if (~explorer.indexOf('WebKit')) {
            return 'webkitAnimationEnd';
        }
        return 'animationend';
    })();
	
	
	
	var logo = {
	        elem: $('.logo'),
	        run: function() {
	            this.elem.addClass('logolightSpeedIn')
	                .on(animationEnd, function() {
	                    $(this).addClass('logoshake').off();
	                });
	        }
	    };
	
	
/*	$('button:first').click(function(){*/
//		swipe.scrollTo($("#content").width(),5000);
//		$boy.addClass('slowWalk');
//		$boy.css({
//			'left': width+'px',
//			'-moz-transition': '15s',
//			'-webkit-transition': '15s',
//			'-o-transition': '15s',
//			'transition': '15s',
//		});
//		var distX = calculateDist('x', 0.5);
//		var distY = calculateDist('y', 0.5);
//		walkRun(15000, distX, distY);
		// 太阳公转
        $("#sun").addClass('rotation');
     // 飘云
        $(".cloud:first").addClass('cloud1Anim');
        $(".cloud:last").addClass('cloud2Anim');
        var audio1 = Html5Audio(audioConfig.playURL);
        audio1.end(function(){
        	Html5Audio(audioConfig.cycleURL, true);
        })
		//第一次走路，花2000ms走到x的0.5倍的地方，
		boy.walkTo(2000,0.5)//这个时候返回的是一个deffer对象，只有deffer对象resolve之后，才会执行then中的操作
		//第一次走路结束
		.then(function(){
			 scrollTo(5000, 1);//滑动的的时间，滑动距离的比例
			 bird.fly();
		})
		
		//第二次走
		.then(function(){
			return boy.walkTo(5000,0.5);//必须限制有先后关系的一定要用return？？
		})
		//暂停走路
		.then(function(){
			boy.stopWalk();
		})
		//开门
		.then(function(){
			return openDoor();
		})
		.then(function() {
            //开灯
            lamp.bright()
        })
        .then(function() {
            //进商店
            return boy.toShop(2000)
        })
        .then(function(){
        	return boy.takeFlower();
        })
        .then(function() {
            //出商店
            return boy.outShop(2000)
        })
        .then(function(){
        	return closeDoor();
        })
        .then(function() {
            //灯暗
            lamp.dark();
           
        })
        .then(function(){
        	scrollTo(5000, 2);//滑动的x的距离，滑动时间，其实小男孩本身没有移动，移动的是背景
        	
        })//下面是处理桥上的状态
        .then(function(){
        	return boy.walkTo(5000, 0.15);//这个地方换成2000好像就有问题！！！！
        	
        })
        .then(function(){
        	//var girlTop = girl.getOffset().top;
        	return boy.walkTo(2000, 0.25, (girl.getOffset().top ) / visualHeight);
        
        })
        .then(function(){
        	var boyWidth = $("#boy").width();
        	var girlLeft = girl.getOffset().left;
        	var pro = ( girlLeft - boyWidth)/visualWidth;        	
        	return boy.walkTo(2500, pro);
        	
        })
        .then(function(){
        	boy.restore();
        })
        .then(function() {
                // 增加转身动作 
            var d =  $.Deferred();   
        	setTimeout(function() {
                    girl.rotate();
                    boy.rotate(function() {
                        // 开始logo动画
                        logo.run();
                        snow.snowflake()
                        d.resolve();
                    });
                }, 1000);
        	return d;
            })
//            .then(snow.snowflake())
        ;
		
//	});
//	$('button:last').click(function(){
////		swipe.scrollTo($("#content").width(),5000);
//		 var left = $boy.css('left');
//	        // 强制做了一个改变目标left的处理
//	        // 动画是要运行10秒,所以此时动画还是没有结束的
//	        $boy.css('left',left);
//		$boy.addClass('pauseWalk');
//		
//		
//	});
	
}

function doorAction(left, right, time){
	var $door = $(".door");
	var doorLeft = $('.door-left');
    var doorRight = $('.door-right');
    var defer = $.Deferred();
    var count = 2;
    var complete = function(){
    	if(count == 1){
    		defer.resolve();
    		return;
    	}
    	count--;
    }
    doorLeft.transition({
        'left': left
    }, time, complete);
    doorRight.transition({
        'left': right
        }, time, complete);
    return defer;
}
//开门
function openDoor(){
	return doorAction('-50%','100%', 2000);
}
function closeDoor(){
	return doorAction('0%','50%', 2000);
}
//开门灯亮
$('button:eq(2)').click(function(){
	openDoor().then(
	function(){
		lamp.bright();
	}		
	);
});
//关门灯灭
$('button:eq(3)').click(function(){
	closeDoor().then(
		function(){
			 lamp.dark();
		}
	);
});
//不作为全局变量可以吗
var lamp = {
	elem: $('.b_background'),	//返回的不是一个nodelist吗？这里可以直接拿到吗？
	bright: function(){
		this.elem.addClass('lamp-bright');
	},
	dark: function(){
		this.elem.removeClass('lamp-bright');
	}
}





