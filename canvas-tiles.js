var tilesize = 50;

  var r = (Math.floor(Math.random()*255));
  var g = (Math.floor(Math.random()*255));
  var b = (Math.floor(Math.random()*255));

function randomColor() {

  /* fix ahead of time
  var r = (Math.floor(Math.random()*255));
  var g = (Math.floor(Math.random()*255));
  var b = (Math.floor(Math.random()*255));
  */

  return "rgb(" + r + "," + g + "," + b + ")";
}

var tilegrid = [];
var entities = ["dagger", "heart", "wall"]
var player = {avatar: "cat_l",
              x: 0,
              y: 0,
              hearts: 0,
              swords: 0
              }

function random_int(min, max) {
  var x = Math.floor(Math.random()*(max-min+1)) + min;
  return x;
}

function random_element(arr) {
  var x = arr[random_int(0, arr.length-1)];
  return x;
}

function initialize_random(width, height) {

  // randomize the color
  r = (Math.floor(Math.random()*255));
  g = (Math.floor(Math.random()*255));
  b = (Math.floor(Math.random()*255));

  tilegrid = [];
  for(var y = 0; y < height; y++) {
    tilegrid.push([]);
    for(var x = 0; x < width; x++) {
      var entity = random_element(entities);
      tilegrid[y][x] = [entity]
    } // end for loop over x
  } //end for loop over y

  tilegrid[player.y][player.x] = [player.avatar];
  
  var exit_x = random_int(0, width - 1);
  var exit_y = random_int(0, height - 1);
  tilegrid[exit_y][exit_x] = ["exit"];
}

function draw(canvas) {

  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var height = tilegrid.length;
  var width = 0;
  if (height > 0) { width = tilegrid[0].length; }

  /* fill with random colors
  for (var y = 0; y < height; y++) {
    for(var x = 0; x < width; x++) {
      ctx.fillStyle = randomColor();
      ctx.fillRect(x*tilesize,y*tilesize,tilesize,tilesize);
    }
  }
  */

  /* draw what's in tilegrid*/
  for (var y = 0; y < height; y++) {
    for(var x = 0; x < width; x++) {
      for(var entity_index = 0; entity_index < tilegrid[y][x].length; entity_index++) {
        var entity_name = tilegrid[y][x][entity_index];
        var img = document.getElementById(entity_name);
        console.log("drawing " + entity_name);
        ctx.drawImage(img, x*tilesize, y*tilesize, tilesize, tilesize); 
      }
    }
  }
  

}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function getTilePos(canvas, evt) {
  var mousepos = getMousePos(canvas, evt);
  var x = Math.floor(mousepos.x/tilesize);
  var y = Math.floor(mousepos.y/tilesize);
  return {x:x, y:y};
}

function rewriteTile(x, y, entity, canvas) {
  if(entity != "empty") {
    tilegrid[y][x] = [entity];
    drawTileRandomColor(x, y, canvas);
    redrawTile(x, y, entity, canvas);
  } else {
    tilegrid[y][x] = [];
    drawTileRandomColor(x, y, canvas);
  }
}

function redrawTile(x, y, image, canvas) {
  var ctx = canvas.getContext('2d');
  var img = document.getElementById(image);
  ctx.drawImage(img, x*tilesize, y*tilesize, tilesize, tilesize);
}

function drawTileRandomColor(x, y, canvas) {
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = randomColor();
  ctx.fillRect(x*tilesize, y*tilesize, tilesize, tilesize);
}

function doMouseUp(e, canvas) {
  var pos = getTilePos(canvas, e);
  // alert("X=" + pos.x + ", Y = " + pos.y);  
  // redrawTile(pos.x, pos.y, canvas);
}

// Keycodes for directional movement
var W = 87;
var A = 65;
var S = 83;
var D = 68;


function tile_width(canvas) {return canvas.width/tilesize;}
function tile_height(canvas) {return canvas.height/tilesize;}

function max_y(canvas) {
  return tile_height(canvas) - 1;
}

function max_x(canvas) {
  return tile_width(canvas) - 1;
}

function collide(entity, canvas) {
    // hearts and swords
    if(entity == "heart") {
      player.hearts++;
    }
    if(entity == "dagger") {
      player.swords++; 
    }
    if(entity == "exit") {
      console.log("got to exit!");
      initialize_random(tile_width(canvas), tile_height(canvas));
      draw(canvas);
    }
}

function move_player_up(canvas) {
  console.log("up");

  if(player.y > 0) {

    var collision_tile = tilegrid[player.y-1][player.x][0];
    
    // if we can pass thru, do so
    if(collision_tile != "wall") {
      rewriteTile(player.x, player.y, "empty", canvas);
      player.y--;
      collide(collision_tile, canvas);
    } 
    player.avatar = "cat_u";
    rewriteTile(player.x, player.y, player.avatar, canvas); 

  }

  // else, no movement

}



function move_player_down(canvas) {
  console.log("down");

  if(player.y < max_y(canvas)) {
    var collision_tile = tilegrid[player.y+1][player.x][0];
    
    // if we can pass thru, do so
    if(collision_tile != "wall") {
      rewriteTile(player.x, player.y, "empty", canvas);
      player.y++;
      collide(collision_tile, canvas);
    } 
    player.avatar = "cat_d";
    rewriteTile(player.x, player.y, player.avatar, canvas); 
  }

  // else, no movement

}

function move_player_left(canvas) {
  console.log("left");

  if(player.x > 0) {
    var collision_tile = tilegrid[player.y][player.x-1][0];
    
    // if we can pass thru, do so
    if(collision_tile != "wall") {
      rewriteTile(player.x, player.y, "empty", canvas);
      player.x--;
      collide(collision_tile, canvas);
    } 
    player.avatar = "cat_l";
    rewriteTile(player.x, player.y, player.avatar, canvas); 
  }

  // else, no movement

}

function move_player_right(canvas) {
  console.log("right");

  if(player.x < max_x(canvas)) {

    var collision_tile = tilegrid[player.y][player.x+1][0];
    
    // if we can pass thru, do so
    if(collision_tile != "wall") {
      rewriteTile(player.x, player.y, "empty", canvas);
      player.x++;
      collide(collision_tile, canvas);
    } 
    player.avatar = "cat_r";
    rewriteTile(player.x, player.y, player.avatar, canvas); 
  }

  // else, no movement

}

function onKeypress(e, canvas) {
  var key = e.keyCode;
  console.log("Key pressed: " + key);
  if(key == W) {
    move_player_up(canvas);
  }
  if(key == S) {
    move_player_down(canvas);
  }
  if(key == A) {
    move_player_left(canvas);
  }
  if(key == D) {
    move_player_right(canvas);
  }
}


// UI stuff
function ui() {

var canvas = document.getElementById('map');
var generateButton = document.getElementById("generateButton");

generateButton.addEventListener("click", function () {
    var width = canvas.width/tilesize;
    var height = canvas.height/tilesize;
    initialize_random(width, height);
    draw(canvas);
});

canvas.addEventListener("mouseup", 
  function(e) { doMouseUp(e, canvas); }, 
  false);


document.addEventListener("keydown", 
    function(e) { onKeypress(e, canvas) }, 
    false);

}
