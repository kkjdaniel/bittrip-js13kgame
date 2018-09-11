var context = document.getElementById('game').getContext('2d');

var GAME = {
  STATES: {
    MENU: 0,
    PLAY: 1,
    RESTART: 2
  },
  STATE: 0,
  SCORE: 0
};

var DIRECTIONS = {
  UP: 0,
  DOWN: 1
}

var player = {};

var getNextTile = (function () {
  var height = 100;
  return function () {
    Math.round(Math.random()) ? height < context.canvas.height / 2 && (height += 10) : height > 60 && (height -= 10);
    return {
      height: height,
      offset: Math.random() * (height * 0.6 - 0) + 0
    };
  }
})();

var map = {
  tiles: null,
  nextStep: function () {
    this.tiles.shift();
    this.tiles.push(getNextTile());
  }
}

function step() {
  map.nextStep();
  GAME.SCORE = GAME.SCORE + 1;
  if (GAME.STATE === GAME.STATES.PLAY) {
    setTimeout(step, 25);
  }
};

function initGame() {
  map.tiles = Array.from(Array(50), function () {
    return {
      height: 100,
      offset: 0
    };
  });
  player = {
    x: Math.ceil(context.canvas.width / map.tiles.length),
    y: context.canvas.height / 2 - 10 / 2,
    direction: null
  };
  GAME.SCORE = 0;
  step();
}

function update(progress) {
  if (GAME.STATE === GAME.STATES.PLAY) {
    switch (player.direction) {
      case DIRECTIONS.UP:
        player.y = player.y - 2;
        break;
      case DIRECTIONS.DOWN:
        player.y = player.y + 2;
        break;
    }
    let startBoundary = (context.canvas.height / 2 - map.tiles[1].height / 2 + map.tiles[1].offset);
    let endBoundary = startBoundary + map.tiles[1].height;
    if (player.y + 4 < startBoundary || player.y - 4 > endBoundary) {
      with (new AudioContext)
      with (G = createGain())
      for (i in D = [22, 25, 23, 25, 23])
        with (createOscillator())
        if (D[i])
          connect(G),
            G.connect(destination),
            start(i * .1),
            frequency.setValueAtTime(440 * 1.06 ** (13 - D[i]), i * .1), type = 'square',
            gain.setValueAtTime(1, i * .1),
            gain.setTargetAtTime(.0001, i * .1 + .08, .005),
            stop(i * .1 + .09)
      GAME.STATE = GAME.STATES.RESTART;
    }
  }
}

function draw() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  if (GAME.STATE === GAME.STATES.MENU) {
    context.textBaseline = 'middle';
    context.textAlign = "center";
    context.fillStyle = '#6fea62';
    context.font = "40px Courier New";
    context.fillText("Press Space to Play!", context.canvas.width / 2, context.canvas.height / 2);
  } else if (GAME.STATE === GAME.STATES.PLAY) {
    var quadrantWidth = Math.ceil(context.canvas.width / map.tiles.length);
    map.tiles.forEach(function (quadrant, index) {
      context.fillStyle = index % 2 ? '#84ed78' : '#6fea62';
      context.fillRect(quadrantWidth * index, (context.canvas.height / 2 - quadrant.height / 2) + quadrant.offset, quadrantWidth, quadrant.height);
    });
    context.fillStyle = '#19700f';
    context.fillRect(player.x, player.y, 10, 10);
    context.fillStyle = '#6fea62';
    context.font = "20px Courier New";
    context.fillText("Score: " + GAME.SCORE, 80, 40);
  } else if (GAME.STATE === GAME.STATES.RESTART) {
    context.textBaseline = 'middle';
    context.textAlign = "center";
    context.fillStyle = '#6fea62';
    context.font = "40px Courier New";
    context.fillText("You lost! Score: " + GAME.SCORE, context.canvas.width / 2, context.canvas.height / 2 - 30);
    context.fillText("Press Space to Restart!", context.canvas.width / 2, context.canvas.height / 2 + 30);
  }
}

function loop(timestamp) {
  var progress = timestamp - lastRender

  update(progress)
  draw()
  if (GAME.STATE === GAME.STATES.PLAY) {
    lastRender = timestamp
    window.requestAnimationFrame(loop)
  }
}
var lastRender = 0

window.requestAnimationFrame(loop);

window.addEventListener('keydown', this.check, false);

function check(e) {
  if (GAME.STATE === GAME.STATES.MENU) {
    switch (e.keyCode) {
      case 32:
      playConfirmationSound();
        GAME.STATE = GAME.STATES.PLAY;
        initGame();
        window.requestAnimationFrame(loop);
        break;
    }
  } else if (GAME.STATE === GAME.STATES.PLAY) {
    switch (e.keyCode) {
      case 38:
        player.direction = DIRECTIONS.UP;
        break;
      case 40:
        player.direction = DIRECTIONS.DOWN;
        break;
    }
  } else if (GAME.STATE === GAME.STATES.RESTART) {
    switch (e.keyCode) {
      case 32:
      playConfirmationSound();
        GAME.STATE = GAME.STATES.PLAY;
        initGame();
        window.requestAnimationFrame(loop);
        break;
    }
  }
}

function playConfirmationSound() {
  with(new AudioContext)
with(G=createGain())
for(i in D=[5,7])
with(createOscillator())
if(D[i])
connect(G),
G.connect(destination),
start(i*.1),
frequency.setValueAtTime(440*1.06**(13-D[i]),i*.1),
gain.setValueAtTime(1,i*.1),
gain.setTargetAtTime(.0001,i*.1+.08,.005),
stop(i*.1+.09)
}