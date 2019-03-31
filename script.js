var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight;

window.addEventListener("resize", function () {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

//model

function modelGame() {
    var self = this;

    var myView = null;
    self.bombData = [];
    self.rocketData = [];
    self.expl = [];
    var timer = 0;
    self.score = 0;
    self.playerName = null;

    self.ship = {
        x: w / 2 - 80,
        y: h - 40,
        animx: 0,
        animy: 0
    }

    self.start = function (view) {
        myView = view;
    }

    self.game = function () {
        self.update();
        myView.render();
        self.ship.y = h - 40;
        if (RAF == begin) {
            RAF(self.game);
        }

    }

    self.move = function (EO) {
        EO = EO || window.event;
        self.ship.x = EO.offsetX;
        EO.preventDefault();
    }

    self.begin = function () {
        if (RAF == null) {
            RAF = begin;
            self.game();
        }
    }



    self.touchMove = function (EO) {
        EO = EO || window.event;
        self.ship.x = EO.touches[0].pageX;
        EO.preventDefault();
    }



    self.pause = function (EO) {
        EO = EO || window.event;

        if (EO.which == 32) {
            if (RAF != null) {
                RAF = null;
                setTimeout(() => {
                    context.beginPath();
                    context.fillStyle = 'red';
                    context.font = 'italic bold 15px Arial';
                    context.fillText('Click to start', w / 2 - 40, h / 2 - 7);
                }, 100);
            }
        }
        EO.preventDefault();
    }

    self.update = function () {
        timer += 1;
        //появление бомб
        if (timer % 10 == 0) {
            self.bombData.push({
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
            self.rocketData.push({
                x: self.ship.x,
                y: self.ship.y - 50,
                speedX: 0,
                speedY: -5.5
            });
            self.rocketData.push({
                x: self.ship.x - 5,
                y: self.ship.y - 50,
                speedX: -0.5,
                speedY: -5
            });
            self.rocketData.push({
                x: self.ship.x + 5,
                y: self.ship.y - 50,
                speedX: 0.5,
                speedY: -5
            });
        }
        //движение бомб
        self.bombData.forEach(function (item, i) {
            // физика    
            self.bombData[i].x = self.bombData[i].x + self.bombData[i].speedX;
            self.bombData[i].y = self.bombData[i].y + self.bombData[i].speedY;
            self.bombData[i].angle = self.bombData[i].angle + self.bombData[i].dxangle;

            //границы
            if (self.bombData[i].x >= w - 50 || self.bombData[i].x < 0) {
                self.bombData[i].speedX = -self.bombData[i].speedX;
            }
            if (self.bombData[i].y >= h) {
                self.bombData.splice(i, 1);
            }


            if (Math.abs(self.bombData[i].x + 25 - self.ship.x) < 105 && Math.abs(self.bombData[i].y - self.ship.y) < 25) {


                setTimeout(function () {
                    begin = null;
                    music.pause();
                    music.load();
                }, 300);

                setTimeout(function () {
                    switchToEndPage();
                }, 700);

                // setTimeout(function () {
                //     model = null;
                //     view = null;
                //     controller = null;
                // }, 450);
            }

            //проверка рокет на столкновение с бомбами
            for (var j = 0; j < self.rocketData.length; j++) {
                //произошло столкновение
                if ((Math.abs(self.bombData[i].x + 25 - self.rocketData[j].x - 15) < 50 && Math.abs(self.bombData[i].y - self.rocketData[j].y) < 25) || (Math.abs(self.bombData[i].x + 25 - self.ship.x) < 105 && Math.abs(self.bombData[i].y - self.ship.y) < 25)) {

                    self.expl.push({
                        x: self.bombData[i].x - 25,
                        y: self.bombData[i].y - 25,
                        animx: 0,
                        animy: 0,
                    })


                    self.bombData[i].del = 1;
                    self.score += 1;
                    self.rocketData.splice(j, 1);
                    break;
                }
            }
            if (self.bombData[i].del == 1) {
                self.bombData.splice(i, 1);
            }
        });

        self.expl.forEach(function (item, i) {
            self.expl[i].animx = self.expl[i].animx + 0.5;

            if (self.expl[i].animx > 7) {
                self.expl[i].animy += 1;
                self.expl[i].animx = 0;
            }
            if (self.expl[i].animy > 7) {
                self.expl.splice(i, 1);
            }
        });

        self.rocketData.forEach(function (item, i) {
            self.rocketData[i].y = self.rocketData[i].y + self.rocketData[i].speedY;
            self.rocketData[i].x = self.rocketData[i].x + self.rocketData[i].speedX;

            if (self.rocketData[i].y <= -30) {
                self.rocketData.splice(i, 1);
            }
        });
    }

    var RAF = null,
        begin =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
}

var model;
var view;
var controller;