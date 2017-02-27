/**
 * Created by pc on 2017/2/15.
 */
var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 600;
var RADIUS = 8;//小球的半径
var MARGIN_TOP = 60;//每一个数字距离画布上边距的距离
var MARGIN_LEFT = 30;//第一个数字距离画布的左边距距离
var balls = [];//存储小球
var colors = ["#33b5e5", "#0099cc", "#aa66cc", "#9933cc", "#99cc00", "#669900", "#ffbb33", "#ff8800", "#ff4444", "#cc0000"];
/*-------------------------------------------------------------------------------------------------------------------------------*/

var curShowTimeSeconds = 0;//现在倒计时需要多少秒
var endTime = new Date("2017,3,11"); //月份比较特殊是0-11的，一月直接写0，二月写1，依次类推。
window.onload = function () {

    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;
    MARGIN_LEFT = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;
    MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5)

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    curShowTimeSeconds = getCurShowTimeSeconds();

    setInterval(function () {
        render(context);
        upDate();
    }, 50)
}
/**
 * 转换秒数的函数
 * @returns {*}
 */
function getCurShowTimeSeconds() {
    var curTime = new Date();
    var ret = parseInt((endTime.getTime() - curTime.getTime()) / 1000);//转换成对应的秒数
    return ret >= 0 ? ret : 0;
}

/**
 * 时间改变时的更新函数
 */
function upDate() {
    /*下一次时间*/
    var nextCurShowTimeSeconds = getCurShowTimeSeconds();
    var nexthour = parseInt(nextCurShowTimeSeconds / (60 * 60) % 24);
    var nextminutes = parseInt((nextCurShowTimeSeconds / 60 % 60));
    var nextseconds = parseInt(nextCurShowTimeSeconds % 60);

    /*现在的时间*/
    var curhour = parseInt(curShowTimeSeconds / (60 * 60) % 24);
    var curminutes = parseInt((curShowTimeSeconds / 60 % 60));
    var curseconds = parseInt(curShowTimeSeconds % 60);

    if (nextseconds != curseconds) {
        if (parseInt(curhour / 10) != parseInt(nexthour / 10)) {
            addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curhour / 10));
        }
        if (parseInt(curhour % 10) != parseInt(nexthour % 10)) {
            addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curhour % 10));
        }
        if (parseInt(curminutes / 10) != parseInt(nextminutes / 10)) {
            addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curminutes / 10));
        }
        if (parseInt(curminutes % 10) != parseInt(nextminutes % 10)) {
            addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curminutes % 10));
        }

        if (parseInt(curseconds / 10) != parseInt(nextseconds / 10)) {
            addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curseconds / 10));
        }
        if (parseInt(curseconds % 10) != parseInt(nextseconds % 10)) {
            addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(curseconds % 10));
        }
        curShowTimeSeconds = nextCurShowTimeSeconds;
    }
    // console.log(balls.length);//小球一直是只增五减，需要代码优化
    upDateBalls();
}
/**
 * 对所有小球进行更新操作
 */
function upDateBalls() {
    for (var i = 0, len = balls.length; i < len; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
        if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = -balls[i].vy * 0.6;
        }
    }

    /*判断小球是够走出了页面，走出了就删除掉(性能优化)*/
    var cnt = 0;
    for (var i = 0, len = balls.length; i < len; i++) {
        if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH) {
            balls[cnt++] = balls[i]; // 那些还在页面中的小球索引将被存储到cnt中，条件一成立就将所有的索引存进去cnt里。
        }
    }
    while (balls.length > cnt) {
        balls.pop();//走出页面就删除掉
    }
}
/**
 * 随机小球函数
 * @param x
 * @param y
 * @param num
 */
function addBalls(x, y, num) {
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                var aBall = {
                    x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
                    y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: -5,
                    color: colors[Math.floor(Math.random() * colors.length)]
                }
                balls.push(aBall);//将随机小球添加到数组中
            }

        }

    }
}
/**
 * 渲染绘图环境函数
 */
function render(ctx) {
    ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    var hour = parseInt(curShowTimeSeconds / (60 * 60) % 24);
    //分钟计算：将总共的秒数减去当前时间总共的秒数，剩下的是还有多少分钟多少秒钟。剩下的秒数除以60，就是当前的分钟了。
    var minutes = parseInt((curShowTimeSeconds / 60 % 60));
    var seconds = parseInt(curShowTimeSeconds % 60);
    /*每一次用渲染函数都需要重新计算距离上一个数字的左边距离：
     *   14*（RADIUS+1）那是因为数组是7*10的，也就是在横线上是7*10的位置，那么相应的就是有十四个半径加一那么长，但是为了和右侧的数字留有空隙，
     *   所以把数字改成十五个半径那么长。结论：在程序中每一个数字在横方向上所占的长度为15倍的半径加一*/
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hour / 10), ctx);//因为需要是一个数字一个数组的绘制，所以需要将数字拆分开。
    renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hour % 10), ctx);
    //冒号渲染：对应的第10号二维数组就是渲染冒号的，参数直接写死就好
    renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, ctx);
    /*MARGIN_LEFT + 39*(RADIUS+1)分钟开始这样写是因为冒号那个数组是4*10的，宽度是4位半径宽度形式存在的，4*2等于8倍的边长再加上空隙1一个半径。结论：冒号所占宽度为9个半径*/
    renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), ctx);
    renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), ctx);
    /*秒：*/
    renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, ctx);
    renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), ctx);
    renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), ctx);

    /*小球绘制*/
    for (var i = 0, len = balls.length; i < len; i++) {
        ctx.fillStyle = balls[i].color;
        ctx.beginPath();
        ctx.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();
    }

}
/*四个参数：
 * x:时间的x轴
 * y:
 * 时间的y轴
 * num:传入的数组
 * ctx: 绘制环境*/
/*使用二维循环的方式遍历相应的二维点阵，并且在点阵中每一个唯一的位置画一个实心的小球*/
function renderDigit(x, y, num, ctx) {
    ctx.fillStyle = "rgb(0,102,153)";

    /*i是行数，j是列数,以判断的方式做渲染: if (digit[num][i][j] == 1) {}*/
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                ctx.beginPath();
                ctx.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
                ctx.closePath();
                //填充
                ctx.fill();
            }
        }
    }

}