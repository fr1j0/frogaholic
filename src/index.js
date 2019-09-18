import './styles/main.css'

var g = ga(
    480, 480, setup,
    ["./src/assets/bigFrog2.png"]
);

var exit, player, gameScene, scoreDisplay, blockSize = 48, enemies = [], defaultNumEnemies = 25, level = 1, dangerInterval = 150;
const dangerHeight = blockSize / 3;
let intervalLevel = null;
let tickLevelInterval = 25;
let tickCounter = 0;

function setup() {
    //Set the canvas border and background color
    //Create the `chimes` sound object
    //Create the `gameScene` group
    gameScene = g.group();

    //Create the `exit` door sprite
    //Create the `player` sprite


    //Create the `treasure` sprite
    //Make the enemies
    //Create the health bar
    //Add some text for the game over message
    //Create a `gameOverScene` group 
    //Assign the player's keyboard controllers

    setupPlayer();
    setupKeyLogger();
    // setupScoreDisplay();
    play();

    startLevel();
}

function play() {
    //set the game state to `play`
    g.state = tick;
    g.fps = 25;
}

function startLevel() {
    intervalLevel = setInterval(
        function () {
            //console.log("interval")
            if (enemies.length < level * defaultNumEnemies) {
                //addDanger()
            } else {
                clearInterval(intervalLevel)
                //removeDanger()
            }
        },
        dangerInterval
    )
}

function removeDanger() {
    //let enemyToRemove = enemies.shift()
    const enemyIndex = enemies.findIndex(item => item);
    let enemyToRemove = enemies.splice(enemyIndex, 1)[0];
    g.tweenProperty(enemyToRemove, "width", enemyToRemove.width, 0, 15, "inverseSineCubed")
    setTimeout(function () {
        gameScene.removeChild(enemyToRemove);
    }, dangerInterval / 2)
}

function addDanger() {
    var enemy = g.rectangle(blockSize / 2, blockSize / 2, "red");
    var numYSlots = (g.canvas.height / dangerHeight);
    const randomYSlot = g.randomInt(1, numYSlots);
    enemy.x = 0;
    enemy.y = randomYSlot * dangerHeight;
    enemy.width = 2;
    enemy.height = dangerHeight;

    //Push the enemy into the `enemies` array
    enemies.push(enemy);

    //Add the enemy to the `gameScene`
    gameScene.addChild(enemy);

    setTimeout(function () {
        const tween1 = g.tweenProperty(enemy, "alpha", 0, 1, 5, "inverseSineCubed");
        tween1.onComplete = () => console.log("oncompelte");
        tween1.end()
        g.tweenProperty(enemy, "width", enemy.width, g.randomInt(0, g.canvas.width), 5, "inverseSineCubed")
    }, dangerInterval)
}

function getVerticalSlot() {
    var numYSlots = (g.canvas.height / dangerHeight);
    const randomYSlot = g.randomInt(0, numYSlots);
    //console.log(randomYSlot, enemies[randomYSlot])

    enemies.findIndex(enemy => console.log(enemy))
    return randomYSlot;
    if (enemies[randomYSlot] === undefined) {
        return randomYSlot;
    } else {
        getVerticalSlot()
    }
}

function setupScoreDisplay() {
    scoreDisplay = g.text("1", "20px emulogic", "#00FF00", 400, 10);
    gameScene.addChild(scoreDisplay);
}

function setupPlayer() {
    var playerFrames3 = g.frames(
        "./src/assets/bigFrog2.png", //The tileset image
        [
            [0, 0], [48, 0], [96, 0],
            [0, 48], [48, 48], [96, 48],
            [0, 96], [48, 96], [96, 96],
            [0, 144], [48, 144], [96, 144],
            [0, 192], [48, 192], [96, 192],
            [0, 240], [48, 240], [96, 240],
            [0, 288], [48, 288], [96, 288],
            [0, 336], [48, 336], [96, 336],
        ],     //The `x` and `y` positions of frames
        blockSize, blockSize //The `width` and `height` of each frame
    );
    player = g.sprite(playerFrames3);

    player.states = {
        up: 10,
        left: 4,
        down: 10,
        right: 7,
        walkUp: [9, 11],
        walkLeft: [3, 5],
        walkDown: [9, 11],
        walkRight: [6, 8]
    };

    player.show(1);

    // player.fps = 10;
    player.height = player.width = blockSize;

    player.x = g.canvas.width / 2 - player.width;
    player.y = g.canvas.height / 2 - player.height;
}

function setupKeyLogger() {

    var dx = 10;
    var dy = dx;

    g.key.rightArrow.press = function () {
        player.rotation = 0;
        player.vx = dx;
        player.vy = 0;
        player.playSequence(player.states.walkRight);
    };

    g.key.rightArrow.release = function () {
        if (!g.key.leftArrow.isDown && player.vy === 0) {
            player.vx = 0;
            player.show(player.states.right);
        }
    };

    g.key.leftArrow.press = function () {
        player.rotation = 0;
        player.vx = -dx;
        player.vy = 0;
        player.playSequence(player.states.walkLeft);
    };

    g.key.leftArrow.release = function () {
        if (!g.key.rightArrow.isDown && player.vy === 0) {
            player.vx = 0;
            player.show(player.states.left);
        }
    };

    g.key.downArrow.press = function () {
        player.rotation = Math.PI;
        player.vx = 0;
        player.vy = dy;
        player.playSequence(player.states.walkDown);
    };

    g.key.downArrow.release = function () {
        if (!g.key.upArrow.isDown && player.vx === 0) {
            player.vy = 0;
            player.show(player.states.down);
        }
    };

    g.key.upArrow.press = function () {
        player.rotation = 0;
        player.vx = 0;
        player.vy = -dy;
        player.playSequence(player.states.walkUp);
    };

    g.key.upArrow.release = function () {
        if (!g.key.downArrow.isDown && player.vx === 0) {
            player.vy = 0;
            player.show(player.states.up);
        }
    };
}

function tick() {
    g.move(player);
    g.contain(player, g.stage.localBounds);
    tickLevel()
}

function tickLevel() {
    tickCounter++;
    if (tickCounter > tickLevelInterval) {
        tickCounter = 0;
        console.log("tick level")
        addDanger()
    }
}

//Start the Ga engine.
g.start();
// g.scaleToWindow();
// window.addEventListener("resize", function (event) {
//     g.scaleToWindow();
// });