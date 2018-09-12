var context = document.getElementById("game").getContext("2d");

const HIT_LEEWAY = 4;

const DIRECTIONS = {
  UP: 0,
  DOWN: 1
};

const STATES = {
  MENU: 0,
  PLAY: 1,
  RESTART: 2
};

var GAME = {
  STATE: STATES.MENU,
  SCORE: 0,
  PLAYER: {
    height: 10,
    width: 10
  }
};

let getNextTile = (function() {
  var height = 100;
  return function() {
    Math.round(Math.random())
      ? height < context.canvas.height / 2 && (height += 10)
      : height > 60 && (height -= 10);
    return {
      height: height,
      offset: Math.random() * (height * 0.6 - 0) + 0
    };
  };
})();

let map = {
  getNextTile: (function() {
    var height = 100;
    return function() {
      Math.round(Math.random())
        ? height < context.canvas.height / 2 && (height += 10)
        : height > 60 && (height -= 10);
      return {
        height: height,
        offset: Math.random() * (height * 0.6 - 0) + 0
      };
    };
  })(),
  nextStep: function() {
    this.tiles.shift();
    this.tiles.push(this.getNextTile());
  }
};

function gameTick() {
  map.nextStep();
  GAME.SCORE = GAME.SCORE + 1;
  if (GAME.STATE === STATES.PLAY) {
    setTimeout(gameTick, 25);
  }
}

function initGame() {
  map.tiles = Array.from(Array(50), function() {
    return {
      height: 100,
      offset: 0
    };
  });
  GAME.PLAYER = Object.assign({}, GAME.PLAYER, {
    x: Math.ceil(context.canvas.width / map.tiles.length),
    y: context.canvas.height / 2 - GAME.PLAYER.height / 2,
    direction: null
  });
  GAME.SCORE = 0;
  gameTick();
}

function playConfirmationSound() {
  with (new AudioContext())
    with ((G = createGain()))
      for (i in (D = [5, 7]))
        with (createOscillator())
          if (D[i])
            connect(G),
              G.connect(destination),
              start(i * 0.1),
              frequency.setValueAtTime(440 * 1.06 ** (13 - D[i]), i * 0.1),
              gain.setValueAtTime(1, i * 0.1),
              gain.setTargetAtTime(0.0001, i * 0.1 + 0.08, 0.005),
              stop(i * 0.1 + 0.09);
}

window.addEventListener("keydown", this.check, false);
function check(e) {
  if (GAME.STATE === STATES.MENU) {
    switch (e.keyCode) {
      case 32:
        playConfirmationSound();
        GAME.STATE = STATES.PLAY;
        initGame();
        window.requestAnimationFrame(loop);
        break;
    }
  } else if (GAME.STATE === STATES.PLAY) {
    switch (e.keyCode) {
      case 38:
        GAME.PLAYER.direction = DIRECTIONS.UP;
        break;
      case 40:
        GAME.PLAYER.direction = DIRECTIONS.DOWN;
        break;
    }
  } else if (GAME.STATE === STATES.RESTART) {
    switch (e.keyCode) {
      case 32:
        playConfirmationSound();
        GAME.STATE = STATES.PLAY;
        initGame();
        window.requestAnimationFrame(loop);
        break;
    }
  }
}

function update() {
  if (GAME.STATE === STATES.PLAY) {
    switch (GAME.PLAYER.direction) {
      case DIRECTIONS.UP:
        GAME.PLAYER.y = GAME.PLAYER.y - 2;
        break;
      case DIRECTIONS.DOWN:
        GAME.PLAYER.y = GAME.PLAYER.y + 2;
        break;
    }
    let startBoundary =
      context.canvas.height / 2 - map.tiles[1].height / 2 + map.tiles[1].offset;
    let endBoundary = startBoundary + map.tiles[1].height;
    if (
      GAME.PLAYER.y + HIT_LEEWAY < startBoundary ||
      GAME.PLAYER.y - HIT_LEEWAY > endBoundary
    ) {
      with (new AudioContext())
        with ((G = createGain()))
          for (i in (D = [22, 25, 23, 25, 23]))
            with (createOscillator())
              if (D[i])
                connect(G),
                  G.connect(destination),
                  start(i * 0.1),
                  frequency.setValueAtTime(440 * 1.06 ** (13 - D[i]), i * 0.1),
                  (type = "square"),
                  gain.setValueAtTime(1, i * 0.1),
                  gain.setTargetAtTime(0.0001, i * 0.1 + 0.08, 0.005),
                  stop(i * 0.1 + 0.09);
      GAME.STATE = STATES.RESTART;
    }
  }
}

function draw() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  if (GAME.STATE === STATES.MENU) {
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillStyle = "#6fea62";
    context.font = "40px Courier New";
    context.fillText(
      "Press Space to Play!",
      context.canvas.width / 2,
      context.canvas.height / 2
    );
  } else if (GAME.STATE === STATES.PLAY) {
    var quadrantWidth = Math.ceil(context.canvas.width / map.tiles.length);
    map.tiles.forEach(function(quadrant, index) {
      context.fillStyle = index % 2 ? "#84ed78" : "#6fea62";
      context.fillRect(
        quadrantWidth * index,
        context.canvas.height / 2 - quadrant.height / 2 + quadrant.offset,
        quadrantWidth,
        quadrant.height
      );
    });
    context.fillStyle = "#19700f";
    context.fillRect(GAME.PLAYER.x, GAME.PLAYER.y, GAME.PLAYER.height, GAME.PLAYER.width);
    context.fillStyle = "#6fea62";
    context.font = "20px Courier New";
    context.fillText("Score: " + GAME.SCORE, 80, 40);
  } else if (GAME.STATE === STATES.RESTART) {
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillStyle = "#6fea62";
    context.font = "40px Courier New";
    context.fillText(
      "You lost! Score: " + GAME.SCORE,
      context.canvas.width / 2,
      context.canvas.height / 2 - 30
    );
    context.fillText(
      "Press Space to Restart!",
      context.canvas.width / 2,
      context.canvas.height / 2 + 30
    );
  }
}

function loop(timestamp) {
  let progress = timestamp - lastRender;
  update(progress);
  draw();
  if (GAME.STATE === STATES.PLAY) {
    lastRender = timestamp;
    window.requestAnimationFrame(loop);
  }
}
var lastRender = 0;
window.requestAnimationFrame(loop);