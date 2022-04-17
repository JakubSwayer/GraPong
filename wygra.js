var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = (window.innerHeight);

var iW = innerWidth * 0.5 - 180;
var iH = innerHeight * 0.35;

addEventListener("resize", function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

});
var audio = new Audio("pong.wav");
var c = canvas.getContext('2d');

//  TWORZENIE UŻYTKOWNIKÓW
var list = [];

var punkty_1 = 0;
var punkty_2 = 0;
var win = 5;

var player_height = 120;
var v = 6;
var radius = 30;
var menu = true;
var menu_state = 1;
var cpu_player = false;

var animation;

menu_title = new Image();
menu_title.src = 'StartGame.png';

menu_player1 = new Image();
menu_player1.src = 'Player1.png';

menu_player2 = new Image();
menu_player2.src = 'Player2.png';

menu_indicator = new Image();
menu_indicator.src = 'indicator.png';



function createMenu() {

  var ind_position = 75 + (menu_state - 1)*50;

  c.drawImage(menu_title, iW, iH);
  c.drawImage(menu_player1, iW + 25, iH + 75);
  c.drawImage(menu_player2, iW + 25, iH + 125);
  c.drawImage(menu_indicator, iW, iH + ind_position);

}


function Block(x, y) {
  this.x = x;
  this.y = y;

  this.update = function() {
    c.fillRect(this.x, this.y, 20, player_height);
    if (key_w && key_o && list[0].y > 0 && list[1].y > 0) {
      list[0].y -= v;
      list[1].y -= v;
    } else if (key_w && key_l && list[0].y > 0 && list[1].y < (innerHeight - player_height)) {
      list[0].y -= v;
      list[1].y += v;
    } else if (key_s && key_o && list[1].y > 0 && list[0].y < (innerHeight - player_height)) {
      list[0].y += v;
      list[1].y -= v;
    } else if (key_s && key_l && list[0].y < (innerHeight - player_height) && list[1].y < (innerHeight - player_height)) {
      list[0].y += v;
      list[1].y += v;
    } else if (key_w && list[0].y > 0) {
      list[0].y -= v;
    } else if (key_s && list[0].y < (innerHeight - player_height)) {
      list[0].y += v;
    } else if (key_o && list[1].y > 0) {
      list[1].y -= v;
    } else if (key_l && list[1].y < (innerHeight - player_height)) {
      list[1].y += v;
    }

    if (cpu_player && pilka.x > innerWidth/2 && pilka.dx > 0) {
      if(pilka.y < list[1].y + (player_height/2) && list[1].y > 0) {
        list[1].y -= 2;
      } else if (pilka.y > list[1].y + (player_height/2) && list[1].y < innerHeight - player_height ) {
        list[1].y += 2;
      }
    }
  }
}

list.push(new Block(100, (innerHeight / 2 - player_height / 2)));
list.push(new Block((innerWidth - 100), (innerHeight / 2 - player_height / 2)));

let pilka = {
  x: (innerWidth / 2),
  y: (innerHeight / 2),
  dx: 5,
  dy: 0,

  draw: function() {
    c.beginPath();
    c.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    c.fillStyle = '#F55353';
    c.fill();
  },
  update: function() {

    if (this.x < 130 && this.x > 120 && this.y < (list[0].y + player_height + radius) && this.y > list[0].y - radius) {
      this.dx = -this.dx;
      this.dy = (Math.random() - 0.5) * 8;
      audio.play();
    }
    if (this.x > innerWidth - 130 && this.x < innerWidth - 120 && this.y < (list[1].y + player_height + radius) && this.y > list[1].y - radius) {
      this.dx = -this.dx;
      this.dy = (Math.random() - 0.5) * 8;
      audio.play();

    }
    if (this.y - 30 <= 0 || this.y + 30 >= innerHeight) {
      this.dy = -this.dy;

      audio.play();
    }




    if (this.x <= 0) {
      punkty_2++;
      this.x = (innerWidth / 2);
      this.y = (innerHeight / 2);
      this.dx = 5;
      this.dy = 0;
    } else if (this.x >= innerWidth) {
      punkty_1++;
      this.x = (innerWidth / 2);
      this.y = (innerHeight / 2);
      this.dx = 5;
      this.dy = 0;
    }

    if (punkty_1 == win) {
      punkty_1 = 0;
      punkty_2 = 0;
      audio.play();
    }
    if (punkty_2 == win) {
      punkty_1 = 0;
      punkty_2 = 0;
      audio.play();
    }



    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }
}


var key_w = false;
var key_s = false;
var key_o = false;
var key_l = false;
var pause = 0;

window.onkeydown = function(event) {
  console.log(event);
  switch (event.key) {
    case "w":
      if (list[0].y > 5) {
        key_w = true;
      }
      break;
    case "s":
      if (list[0].y < (innerHeight - player_height - 5)) {
        key_s = true;
        }
      break;
    case "o":
      if (list[1].y > 5  && !cpu_player) {
        key_o = true;
        }
      break;
    case "l":
      if (list[1].y < (innerHeight - player_height - 5) && !cpu_player) {
        key_l = true;
        }
      break;
    case "p":
      pause++;
      if (pause % 2 == 0) {
        animate();
      } else {
        cancelAnimationFrame(animation);
      }
      break;
    case "ArrowUp":
      if (menu_state == 2) {
        menu_state = 1; }
        audio.play();
      break;
    case "ArrowDown":
      if (menu_state == 1) {
        menu_state = 2; }
        audio.play();
        break;
    case "Enter":
    if(menu && menu_state == 1){
      cpu_player = true;
    }
        menu = false;
        break;
  }
};
window.onkeyup = function(event) {
  switch (event.key) {
    case "w":
      key_w = false;
      break;
    case "s":
      key_s = false;
      break;
    case "o":
      key_o = false;
      break;
    case "l":
      key_l = false;
      break;
  }
};



function draw_outcome() {
  c.font = "30px Arial";
  c.strokeStyle = "#F55353";
  c.strokeText(punkty_1, innerWidth / 2 - 80, 50);
  c.strokeText(punkty_2, innerWidth / 2 + 20, 50);
}



function animate() {
  animation = requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  if (menu) {
    createMenu();
  } else {
    for (var i = 0; i < 2; i++) {
      list[i].update();
    }
    pilka.update();
    pilka.update();
    draw_outcome();
  }
}
animate();
