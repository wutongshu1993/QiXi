/**
 * Created by lh on 2016/9/19.
 */
/**
 *
 */

function Snow(){
    var container = $("#content");
    var visualWidth = container.width();
    var visualHeight = container.height();
    var snowflakeURl = [
        'images/snowflake/snowflake1.png',
        'images/snowflake/snowflake2.png',
        'images/snowflake/snowflake3.png',
        'images/snowflake/snowflake4.png',
        'images/snowflake/snowflake5.png',
        'images/snowflake/snowflake6.png',
    ];
    /**
     * 飘雪花
     */
    this.snowflake = function (){
        var $flakeContainer = $('#snowflake');

        //随机产生一张图
        function getImage(){
            return snowflakeURl[Math.floor(Math.random() * 6)];
        }

        /**
         * 创建一个雪花元素
         */
        function  createSnowBox() {
            var  url = getImage();
            return $('<div class="snowbox" />').css({
                'width': 41,
                'height': 41,
                'position': 'absolute',
                'backgroundSize': 'cover',
                'zIndex': 100000,
                'top': '-41px',
                'backgroundImage': 'url(' + url + ')'
            }).addClass('snowRoll');
        }
        
        setInterval(function () {
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity    = 1,
                endPositionTop  = visualHeight - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration        = visualHeight * 10 + Math.random() * 5000;

            // 随机透明度，不小于0.5
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;

            // 创建一个雪花
            var $flake = createSnowBox();

            $flake.css({
                left: startPositionLeft,
                opacity: randomStart}
            );

            // 加入到容器
            $flakeContainer.append($flake);

            // 开始执行动画
            $flake.transition({
                top: endPositionTop,
                left: endPositionLeft,
                opacity: 0.7
            }, duration, 'ease-out', function() {
                $(this).remove() //结束后删除
            });
        },200)
    }
    return this;
}