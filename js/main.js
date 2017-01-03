var circles = [],
    canvas = document.getElementById("myCanvas"),
    context = canvas.getContext("2d"),

    // SETTINGS
    opacity = 0.6,                                      // the opacity of the circles 0 to 1
    colors = ['rgba(34, 49, 63,' + opacity + ')',       // an array of rgb colors for the circles
        'rgba(189, 195, 199,' + opacity + ')'
    ],
    minSize = 2,                                        // the minimum size of the circles in px
    maxSize = 4,                                       // the maximum size of the circles in px
    numCircles = 30,                                   // the number of circles
    minSpeed = -1,                                     // the minimum speed, recommended: -maxspeed
    maxSpeed = 5,                                    // the maximum speed of the circles
    expandState = true,                                      // the direction of expansion
    mousePos = { x: 0, y: 0 };

var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

$('li.project').mouseenter(function() {
    $(this).find('.project-info').show();
});

$('li.project').mouseleave(function() {
    $(this).find('.project-info').hide();
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

Function.prototype.throttle = function (milliseconds) {
    var baseFunction = this,
        lastEventTimestamp = null,
        limit = milliseconds;

    return function () {
        var self = this,
            args = arguments,
            now = Date.now();

        if (!lastEventTimestamp || now - lastEventTimestamp >= limit) {
            lastEventTimestamp = now;
            baseFunction.apply(self, args);
        }
    };
};

function scrollToSkills() {
    $("#skills").ready(function(){
         $("html, body").delay(50).animate({
             scrollTop: $('#skills').offset().top
         }, 1000);
    });
}

function scrollToAbout() {
    $("#about").ready(function(){
        $("html, body").delay(50).animate({
            scrollTop: $('#about').offset().top
        }, 1000);
    });
}

function scrollToContact() {
    $("#contact").ready(function(){
        $("html, body").delay(50).animate({
            scrollTop: $('#contact').offset().top
        }, 1000);
    });
}

function scrollToProjects() {
    $("#projects").ready(function(){
        $("html, body").delay(50).animate({
            scrollTop: $('#projects').offset().top
        }, 1000);
    });
}

function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('header').removeClass('nav-down').addClass('nav-up');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('header').removeClass('nav-up').addClass('nav-down');
        }
    }

    lastScrollTop = st;
}

$(document).bind('mousemove', function(e) {
    updateMousePos(e);
}.throttle(25));

function updateMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}

function buildArray() {
    'use strict';

    for (var i =0; i < numCircles ; i++){
        var color = Math.floor(Math.random() * (colors.length)) + 1,
            left = Math.floor(Math.random() * (canvas.width + 1)),
            top = Math.floor(Math.random() * (canvas.height + 1)),
            size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
            leftSpeed = (Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed)/10,
            topSpeed = (Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed)/10,
            expandState = expandState;

        while(leftSpeed == 0 || topSpeed == 0){
            leftSpeed = (Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed)/10,
                topSpeed = (Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed)/10;
        }
        var circle = {color:color, left:left, top:top, defaultSize:size, leftSpeed:leftSpeed, topSpeed:topSpeed, expandState:expandState };
        circles.push(circle);
    }
}

function highlightCircle() {

}

function build(){
    'use strict';

    for(var h = 0; h < circles.length; h++){
        var curCircle = circles[h];
        context.fillStyle = colors[curCircle.color-1];
        context.beginPath();
        let d = Math.hypot(mousePos.x-curCircle.left, mousePos.y-curCircle.top);
        curCircle.size = d < 60 ? (60-d)/15*curCircle.defaultSize > curCircle.defaultSize ? (60-d)/15*curCircle.defaultSize : curCircle.defaultSize: curCircle.defaultSize;
        if(curCircle.left > canvas.width+curCircle.size){
            curCircle.left = 0-curCircle.size;
            context.arc(curCircle.left, curCircle.top, curCircle.size, 0, 2 * Math.PI, false);
        }else if(curCircle.left < 0-curCircle.size){
            curCircle.left = canvas.width+curCircle.size;
            context.arc(curCircle.left, curCircle.top, curCircle.size, 0, 2 * Math.PI, false);
        }else{
            curCircle.left = curCircle.left+curCircle.leftSpeed;
            context.arc(curCircle.left, curCircle.top, curCircle.size, 0, 2 * Math.PI, false);
        }

        if(curCircle.top > canvas.height+curCircle.size){
            curCircle.top = 0-curCircle.size;
            context.arc(curCircle.left, curCircle.top, curCircle.size, 0, 2 * Math.PI, false);

        }else if(curCircle.top < 0-curCircle.size){
            curCircle.top = canvas.height+curCircle.size;
            context.arc(curCircle.left, curCircle.top, curCircle.size, 0, 2 * Math.PI, false);
        }else{
            curCircle.top = curCircle.top+curCircle.topSpeed;
            if(curCircle.size != maxSize && curCircle.size != minSize && curCircle.expandState == false){
                curCircle.size = curCircle.size-0.1;
            }
            else if(curCircle.size != maxSize && curCircle.size != minSize && curCircle.expandState == true){
                curCircle.size = curCircle.size+0.1;
            }
            else if(curCircle.size == maxSize && curCircle.expandState == true){
                curCircle.expandState = false;
                curCircle.size = curCircle.size-0.1;
            }
            else if(curCircle.size == minSize && curCircle.expandState == false){
                curCircle.expandState = true;
                curCircle.size = curCircle.size+0.1;
            }
            context.arc(curCircle.left, curCircle.top, curCircle.size, 0, 2 * Math.PI, false);
        }

        context.closePath();
        context.fill();
        context.ellipse;
    }
}


var xVal = 0;

window.requestAnimFrame = (function (callback) {
    'use strict';
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000/60);
        };
})();

function animate() {
    'use strict';
    var canvas = document.getElementById("myCanvas"),
        context = canvas.getContext("2d");

    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);


    // draw the next frame
    xVal++;
    build();

    //console.log("Prep: animate ==> requestAnimFrame");
    // request a new frame
    requestAnimFrame(function () {
        animate();
    });
}
window.onload = function () {
    'use strict';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    buildArray();
    animate();
};


window.onresize = function () {
    'use strict';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //buildArray();
    animate();
};
