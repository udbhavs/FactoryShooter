//The game state
var playState = {
    create: create, 
    update: update  
}

var width = window.innerWidth, height = window.innerHeight;
var w = window.innerWidth/1200, h = window.innerHeight/800;

//Declare variables in global scope
var rob, bullets, sky, country, factory, scoreText, fireGas, powerText, bubble;
//cursors
var cursors;
//sounds
var jump, fire, playMusic, hitSound, spewSound, hardHit, powerup;
//Variables for firing bullets;
var fireRate = 100, nextFire = 0;
//keys 
var spaceKey;
//Buttons
var buttonLeft, buttonRight, buttonUp, buttonShoot;
var leftPressed, rightPressed, upPressed, shootPressed;
//Variable to check if any power up is active
var poweredUp, currentPowerUp;

//Player Object
var playerObj = {
    speedLeft: -400 * w,
    speedRight: 400 * w,
    speedUp: -300 * h,
    bounceY: 0.4,
    gravityY: 700 * h,
    health: 100,
    prevFactoryHit: 0,
    hitRate: 400,
    score: 0,
    hitIncrement: 20
}

//Object for bullets
var bulletObj = {
    speedX: 650 * w
}

//Object for factory
var factoryObj = {
    health : 100,
    prevSpew: 0,
    spewRate: 1000,
    maxFire: 15,
    fireGas: {
        speedX: -300 * w,
        damage: 10
    }
}

//text style
var textStyle = {
    font: "bold 32px Arial",
    fill: "#000"
}

//Object to control power ups
var powerObj = {
    prevTime: 0,
    rate: 20000,
    time: 6000,
    prevActivate: 0
}

//Power-ups
var powerUps = [
    {
        name: "Double Speed!",
        effect: function() {
            playerObj.speedLeft *= 2;
            playerObj.speedRight *= 2;
        },
        reverse: function() {
            playerObj.speedLeft /= 2;
            playerObj.speedRight /=2;
        }
    },
    {
        name: "Double Thrust!",
        effect: function() {
            playerObj.speedUp *= 2;
        },
        reverse: function() {
            playerObj.speedUp /= 2;
        }
    },
    {
        name: "Factory Slowdown!",
        effect: function() {
            factoryObj.spewRate *= 2;
        },
        reverse: function() {
            factoryObj.spewRate /= 2;
        }
    },
    {
        name: "Fast Bullets",
        effect: function() {
            bulletObj.speedX *= 2;
        },
        reverse: function() {
            bulletObj.speedX /= 2;
        }
    },
    {
        name: "Extra Health!",
        effect: function() {
            playerObj.health += 30;
        },
        reverse: function() {
            
        }
    },
    {
        name: "Double Score!",
        effect: function() {
            playerObj.hitIncrement *= 2;
        },
        reverse: function() {
            playerObj.hitIncrement /= 2;
        }
    }
]

function create() {
    
    //version 
    console.log("v 1.9");
    
    //Start physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //Sounds
    jump = game.add.audio("jump");
    fire = game.add.audio("fire");
    playMusic = game.add.audio("playMusic");
    playMusic.loopFull();
    hitSound = game.add.audio("hit");
    spewSound = game.add.audio("spew");
    hardHit = game.add.audio("hardHit");
    powerup = game.add.audio("powerup");
    
    console.log(playerObj.speedRight, w);
    
    //Set cursors
    cursors = game.input.keyboard.createCursorKeys();
    
    //Set keys
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(fireBullets);
    
    //Sky background
    sky = game.add.sprite(0, 0, "sky");
    sky.width = width; 
    sky.height = height;
    
    //Main character + Physics properties
    rob = game.add.sprite(50, 50, "rob");
    rob.frame = 0;
    game.physics.arcade.enable(rob);
    rob.body.bounce.y = playerObj.bounceY;
    rob.body.gravity.y = playerObj.gravityY;
    rob.body.collideWorldBounds = true;
    
    //Main character animation
    rob.animations.add("fly", [0, 2, 3, 4]);
    
    //Factory
    factory = game.add.sprite(width*3/4, 0, "factory");
    game.physics.arcade.enable(factory);
    factory.height = height;
    factory.width = width/4;
    factory.body.collideWorldBounds = true;
    
    //Bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(20, "bullet");
    bullets.setAll("checkWorldBounds", true);
    bullets.setAll("outOfBoundsKill", true);
    
    //Fire Gas spewed by the factory
    fireGas = game.add.group();
    fireGas.enableBody = true;
    fireGas.physicsBodyType = Phaser.Physics.ARCADE;
    fireGas.createMultiple(factoryObj.maxFire, "fireGas");
    fireGas.setAll("checkWorldBounds", true);
    fireGas.setAll("outOfBoundsKill", true);
    fireGas.callAll("animations.add", "animations", "glow", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
    //Score text
    scoreText = game.add.text(0, 0, "Score: " + playerObj.score + "   " + "Health: " + playerObj.health, textStyle);
    
    //Power Up text
    powerText = game.add.text(0, 0, "", {
        font: "bold 30px Arial",
        fill: "#000",
        boundsAlignH: "center",
        boundsAlignV: "middle"
    });
    powerText.visible = false;
    powerText.setTextBounds(0, height - 50, width, 50);
    
    //Power up bubble
    bubble = game.add.sprite(game.world.centerX, game.world.centerY, "bubble");
    bubble.visible = false;
    bubble.width = 64;
    bubble.height = 64;
    game.physics.arcade.enable(bubble);
    
    //Buttons
    addButtons();
    
}

function update() {
    
    //Check collisions
    game.physics.arcade.collide(factory, bullets, bulletHitFactory);
    game.physics.arcade.collide(rob, factory, playerHitFactory);
    game.physics.arcade.overlap(rob, fireGas, fireHitPlayer);
    game.physics.arcade.overlap(bullets, fireGas, bulletsHitFire);
    
    //If power up is visible(available) check collision
    if (bubble.visible) {
        game.physics.arcade.overlap(rob, bubble, activatePowerUp);
    }
    
    //Check rob's health
    if (playerObj.health <= 0) {
        playMusic.stop();
        game.state.start("lose");
    }
    
    //Reset x velocity each frame; y velocity is in control of physics (because of gravity)
    rob.body.velocity.x = 0;
    
    //Check key pressed
    checkKeys()
    
    //Check if the guy is falling down
    if (rob.body.velocity.y > 0) {
        rob.frame = 1;
    }
    
    //Spew gas from factory
    factorySpew();
    
    //Create Power Up
    if (game.time.now > powerObj.prevTime + powerObj.rate) {
        powerObj.prevTime = game.time.now;
        createPowerUp();
    }
    if (poweredUp && game.time.now > powerObj.prevActivate + powerObj.time) {
        currentPowerUp.reverse();
        poweredUp = false;
        powerText.visible = false;
        console.log("power end");
    }
    
    //change score text
    scoreText.text = "Score: " + playerObj.score + "   " + "Health: " + playerObj.health;
        
}

//Check input keys
function checkKeys() {
    
    if (cursors.up.isDown || upPressed) {
        rob.body.velocity.y = playerObj.speedUp;
        jump.play();
        rob.animations.play("fly", 10, false);
    }
    else {
        rob.frame = 0;
    }
    if (cursors.left.isDown || leftPressed) {
        rob.body.velocity.x = playerObj.speedLeft;
    }
    else if (cursors.right.isDown || rightPressed) {
        rob.body.velocity.x = playerObj.speedRight;
    }
    
}

//Fire sprite's gun
function fireBullets() {
    //Fire according to fire rate
    if (game.time.now > nextFire && bullets.countDead() > 0) {
        nextFire = game.time.now + fireRate;
        var bullet = bullets.getFirstDead();
        bullet.reset(rob.x, rob.y);
        fire.play();
        bullet.body.velocity.x = bulletObj.speedX;
    }
}

//called when bullet hits factory
function bulletHitFactory(factory, bullet) {
    bullet.kill();
    hardHit.play();
    playerObj.score += playerObj.hitIncrement;
}

//When player hits factory
function playerHitFactory(player, factory) {
    if (game.time.now > playerObj.prevFactoryHit + playerObj.hitRate) {
        playerObj.prevFactoryHit = game.time.now;
        playerObj.health -= 10;
        hitSound.play();
    }
}

//Function for factory to randomly spew gas
function factorySpew() {
    if (game.time.now > factoryObj.prevSpew + factoryObj.spewRate) {
        factoryObj.prevSpew = game.time.now;
        var gas1 = fireGas.getFirstDead();
        var randomHeightInt = Math.round(Math.random() * 10)/10;
        gas1.reset(width - factory.width, randomHeightInt * factory.height);
        gas1.width = width/12;
        gas1.height = gas1.width;
        spewSound.play();
        gas1.animations.play("glow", 10);
        gas1.body.velocity.x = factoryObj.fireGas.speedX;
    }
}

//function for gas hit player
function fireHitPlayer(player, gas) {
    gas.kill();
    hitSound.play();
    playerObj.health -= factoryObj.fireGas.damage;
}

//When bullets hit fire 
function bulletsHitFire(bullet, fire) {
    bullet.kill();
    fire.kill();
}

//Get high score from local storage
function getScore() {
    return parseInt(localStorage.getItem("score"));
}

//set score to local storage
function setScore(num) {
    localStorage.setItem("score", num.toString());
}

function createPowerUp() {
    powerup.play();
    bubble.visible = true;
    bubble.x = game.rnd.integerInRange(bubble.width, width - (bubble.width + factory.width));
    bubble.y = game.rnd.integerInRange(bubble.height, height - bubble.height);
}

//Create a power up in a random location
function activatePowerUp() {
    console.log("power start!");
    //Check is any power up is active
    if (poweredUp) {
        currentPowerUp.reverse();
    }
    //activation code
    powerObj.prevActivate = game.time.now;
    bubble.visible = false;
    currentPowerUp = game.rnd.pick(powerUps);
    console.log(currentPowerUp.name);
    powerText.setText(currentPowerUp.name);
    powerText.visible = true;
    currentPowerUp.effect();
    poweredUp = true;
}

function addButtons() {
    buttonRight = game.add.button(120, height - 110, "arrow");
    buttonRight.width = 120;
    buttonRight.height = 100;
    buttonRight.fixedToCamera = true;
    buttonRight.events.onInputDown.add(function() { rightPressed = true; });
    buttonRight.events.onInputUp.add(function() { rightPressed = false; });
    
    buttonLeft = game.add.button(120, height - 110, "arrow");
    buttonLeft.width = 120;
    buttonLeft.height = 100;
    buttonLeft.scale.x *= -1;
    buttonLeft.fixedToCamera = true;
    buttonLeft.events.onInputDown.add(function() { leftPressed = true; });
    buttonLeft.events.onInputUp.add(function() { leftPressed = false; });
    
    buttonUp = game.add.button(width - 240, height - 10, "whiteArrow");
    buttonUp.width = 90;
    buttonUp.height = 120;
    buttonUp.angle = -90;
    buttonUp.fixedToCamera = true;
    buttonUp.events.onInputDown.add(function() { upPressed = true; });
    buttonUp.events.onInputUp.add(function() { upPressed = false; });
    
    buttonShoot = game.add.button(width - 110, height - 110, "circle");
    buttonShoot.width = 100;
    buttonShoot.height = 100;
    buttonShoot.fixedToCamera = true;
    buttonShoot.events.onInputDown.add(function() { fireBullets(); });
}
