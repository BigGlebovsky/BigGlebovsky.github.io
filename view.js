//view

function viewGame() {
    var self = this;

    var myModel = null;
    var myField = null;
    var myCtx = null;
    var foningImg, bombImg, shipImg, rocketImg, explImg;

    self.start = function (model, field) {
        myModel = model;
        myField = field;
        myCtx = myField.getContext('2d');

        foningImg = new Image();
        foningImg.src = 'img/fon.jpg';

        bombImg = new Image();
        bombImg.src = 'img/bomb.png';

        shipImg = new Image();
        shipImg.src = 'img/ship.png';

        rocketImg = new Image();
        rocketImg.src = 'img/rocket.png';

        explImg = new Image();
        explImg.src = 'img/expl.png';

        explImg.onload = function () {
            myModel.game();        
        }
        self.render();
    }

    self.beginGame = function() {
    setTimeout(function () {
        context.beginPath();
        context.fillStyle = 'Black';
        context.font = 'italic bold 20px Arial';
        context.fillText('Click to play ' + myModel.playerName, w / 2 - 50, h / 2 - 10);

    }, 100);
}

    self.render = function() {
        myCtx.drawImage(foningImg, 0, 0, w, h);
        myCtx.drawImage(shipImg, myModel.ship.x - 80, myModel.ship.y - 30, 160, 60);
        myModel.rocketData.forEach(function (item, i) {
            myCtx.drawImage(rocketImg, myModel.rocketData[i].x, myModel.rocketData[i].y, 30, 30)
        });
    
        myModel.bombData.forEach(function (item, i) {
            myCtx.save();
            myCtx.translate(myModel.bombData[i].x + 25, myModel.bombData[i].y + 25);
            myCtx.rotate(myModel.bombData[i].angle);
            myCtx.drawImage(bombImg, -25, -25, 50, 50);
            myCtx.restore();
        });
    
        myModel.expl.forEach(function (item, i) {
            myCtx.drawImage(explImg, 128 * Math.floor(myModel.expl[i].animx), 128 * Math.floor(myModel.expl[i].animy), 128, 128, myModel.expl[i].x, myModel.expl[i].y, 100, 100);
        });
    
    
        myCtx.beginPath();
        myCtx.fillStyle = 'Black';
        myCtx.font = 'italic bold 20px Arial';
        myCtx.fillText('Score:' + myModel.score, 10, 30);
    
        myCtx.beginPath();
        myCtx.fillStyle = 'Black';
        myCtx.font = 'italic bold 20px Arial';
        myCtx.fillText('Name:' + myModel.playerName, 10, 60);
    
    
    }
    
    function beginGame() {
        setTimeout(function () {
            myCtx.beginPath();
            myCtx.fillStyle = 'Black';
            myCtx.font = 'italic bold 20px Arial';
            myCtx.fillText('Click to play ' + myModel.playerName, w / 2 - 50, h / 2 - 10);
    
        }, 100);
    }

}
