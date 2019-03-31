'use strict'

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight;

window.addEventListener("resize", function () {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});
//controller

canvas.addEventListener("mousemove", function (EO) {
    EO = EO || window.event;
    ship.x = EO.offsetX;

});

canvas.addEventListener("touchstart", function (EO) {
    EO = EO || window.event;
    ship.x = EO.touches[0].offsetX;
    if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
        event.targetTouches.length > 1) {
        return;
    }

    if (window.navigator.msPointerEnabled) {
        ship.x = event.pageX;

    } else {
        ship.x = event.touches[0].clientX;

    }

    event.preventDefault();
});

canvas.addEventListener("touchmove", function (event) {
    event.preventDefault();
});

canvas.addEventListener("touchend", function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
        event.targetTouches.length > 0) {
        return;
    }

    if (window.navigator.msPointerEnabled) {
        ship.x = event.pageX;
    } else {
        ship.x = event.changedTouches[0].clientX;
    }

});


canvas.addEventListener("click", function (EO) {
    EO = EO || window.event;
    if (RAF == null) {
        RAF = begin;
        game();
    }

});

canvas.addEventListener("keydown", function (EO) {
    EO = EO || window.event;

    if (EO.which == 32) {
        if (RAF != null) {
            RAF = null;
            pause();
        }
    }
});



function pause() {
    setTimeout(() => {
        context.beginPath();
        context.fillStyle = 'red';
        context.font = 'italic bold 15px Arial';
        context.fillText('Click to start', w / 2 - 40, h / 2 - 7);
    }, 100);

}



//model

var bombData = [];
var rocketData = [];
var expl = [];
var timer = 0;
var score = 0;
var playerName = null;


var ship = {
    x: w / 2,
    y: h - 40,
    animx: 0,
    animy: 0
}

function game() {
    update();
    render();
    ship.y = h - 40;
    if (RAF == begin) {
        RAF(game);
    }

}

function update() {
    timer += 1;
    //появление бомб
    if (timer % 10 == 0) {
        bombData.push({
            angle: 0,
            dxangle: Math.random() * 0.2 - 0.1,
            x: Math.random() * (w - 50),
            y: -50,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 + 2,
            del: 0
        });
    }
    //появление ракет
    if (timer % 20 == 0) {
        rocketData.push({
            x: ship.x,
            y: ship.y - 50,
            speedX: 0,
            speedY: -5.5
        });
        rocketData.push({
            x: ship.x - 5,
            y: ship.y - 50,
            speedX: -0.5,
            speedY: -5
        });
        rocketData.push({
            x: ship.x + 5,
            y: ship.y - 50,
            speedX: 0.5,
            speedY: -5
        });
    }
    //движение бомб
    bombData.forEach(function (item, i) {
        // физика    
        bombData[i].x = bombData[i].x + bombData[i].speedX;
        bombData[i].y = bombData[i].y + bombData[i].speedY;
        bombData[i].angle = bombData[i].angle + bombData[i].dxangle;

        //границы
        if (bombData[i].x >= w - 50 || bombData[i].x < 0) {
            bombData[i].speedX = -bombData[i].speedX;
        }
        if (bombData[i].y >= h) {
            bombData.splice(i, 1);
        }

        // столкновение с кораблем
        // if (ship.x < bombData[i].x + (140) &&
        //     ship.x + (140) > bombData[i].x &&
        //     ship.y < bombData[i].y + (70) &&
        //     ship.y + (70) > bombData[i].y) 

        if (Math.abs(bombData[i].x + 25 - ship.x) < 105 && Math.abs(bombData[i].y - ship.y) < 25) {                      
            
            
            setTimeout(function () {
                begin = null;
                music.pause();
            }, 300);

            setTimeout(function () {
                    switchToEndPage();
                }, 700);

            setTimeout(function () {
                bombData = [];
                rocketData = [];
                expl = [];
                timer = 0;
                score = 0;
                playerName = null;

                

                ship = {
                    x: w / 2 - 75,
                    y: h - 37.5,
                    animx: 0,
                    animy: 0
                }
            }, 450);
        }

        //проверка рокет на столкновение с бомбами
        for (var j = 0; j < rocketData.length; j++) {
            //произошло столкновение
            if ((Math.abs(bombData[i].x + 25 - rocketData[j].x - 15) < 50 && Math.abs(bombData[i].y - rocketData[j].y) < 25) || (Math.abs(bombData[i].x + 25 - ship.x) < 105 && Math.abs(bombData[i].y - ship.y) < 25)) {

                expl.push({
                    x: bombData[i].x - 25,
                    y: bombData[i].y - 25,
                    animx: 0,
                    animy: 0,
                })


                bombData[i].del = 1;
                score += 1;
                rocketData.splice(j, 1);
                break;
            }
        }
        if (bombData[i].del == 1) {
            bombData.splice(i, 1);
        }
    });

    expl.forEach(function (item, i) {
        expl[i].animx = expl[i].animx + 0.5;

        if (expl[i].animx > 7) {
            expl[i].animy += 1;
            expl[i].animx = 0;
        }
        if (expl[i].animy > 7) {
            expl.splice(i, 1);
        }
    });

    rocketData.forEach(function (item, i) {
        rocketData[i].y = rocketData[i].y + rocketData[i].speedY;
        rocketData[i].x = rocketData[i].x + rocketData[i].speedX;

        if (rocketData[i].y <= -30) {
            rocketData.splice(i, 1);
        }
    });
}

var RAF = null,
    begin =
    // находим, какой метод доступен
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    // ни один не доступен
    // будем работать просто по таймеру
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };


// view
var foningImg = new Image();
foningImg.src = 'img/fon.jpg';

var bombImg = new Image();
bombImg.src = 'img/bomb.png';

var shipImg = new Image();
shipImg.src = 'img/ship.png';

var rocketImg = new Image();
rocketImg.src = 'img/rocket.png';

var explImg = new Image();
explImg.src = 'img/expl.png';

explImg.onload = function () {
    game();    
}

function render() {
    context.drawImage(foningImg, 0, 0, w, h);
    context.drawImage(shipImg, ship.x - 80, ship.y - 30, 160, 60);
    rocketData.forEach(function (item, i) {
        context.drawImage(rocketImg, rocketData[i].x, rocketData[i].y, 30, 30)
    });

    bombData.forEach(function (item, i) {
        context.save();
        context.translate(bombData[i].x + 25, bombData[i].y + 25);
        context.rotate(bombData[i].angle);
        context.drawImage(bombImg, -25, -25, 50, 50);
        context.restore();
    });

    expl.forEach(function (item, i) {
        context.drawImage(explImg, 128 * Math.floor(expl[i].animx), 128 * Math.floor(expl[i].animy), 128, 128, expl[i].x, expl[i].y, 100, 100);
    });


    context.beginPath();
    context.fillStyle = 'Black';
    context.font = 'italic bold 20px Arial';
    context.fillText('Score:' + score, 10, 30);

    context.beginPath();
    context.fillStyle = 'Black';
    context.font = 'italic bold 20px Arial';
    context.fillText('Name:' + playerName, 10, 60);

    
}

function beginGame() {
    setTimeout(function () {
        context.beginPath();
        context.fillStyle = 'Black';
        context.font = 'italic bold 20px Arial';
        context.fillText('Click to play ' + playerName, w / 2 - 50, h / 2 - 10);

    }, 100);
}



update();
render();
