var loadingText = "", loadTextObj;

var loadState = {
    
    preload: preload,
    
    create: function() {
        
        //LOADING SCREEN
        game.stage.backgroundColor = "#4488AA";
        loadTextObj = game.add.text(0, 0, loadingText, {
            font: "bold 40px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
        console.log("text added");
        loadTextObj.setTextBounds(0, height/3, width, 50);
        loadTextObj.setShadow(3, 3, "rgba(0, 0, 0, 0.5)", 15);
        console.log("calling load functions");
        
        //LOADING FUNCTIONS
        game.load.onLoadStart.add(loadStart, this);
        game.load.onFileComplete.add(fileComplete, this);
        game.load.onLoadComplete.add(function() {
            game.state.start("menu");
        }, this);
        
        console.log("called");
        
        //Start
        loadAssets();
        
        console.log("loaded");
                
    }
    
}

function preload() {
    
}

function loadAssets() {
    
    console.log("in loadAssets");
    
    game.load.spritesheet("rob", "assets/robSheet.png", 42, 79);
    game.load.image("sky", "assets/sky.png");
    game.load.image("country", "assets/country.png");
    game.load.image("bullet", "assets/bullet.png");
    game.load.image("factory", "assets/pixelFactory.png");
    game.load.spritesheet("fireGas", "assets/fire.png", 192, 192); //192
    game.load.image("country", "assets/country.png");
    game.load.image("arrow", "assets/arrow.png");
    game.load.image("whiteArrow", "assets/white_arrow.png");
    game.load.image("circle", "assets/circle.png");
    
    //AUDIO
    game.load.audio("jump", ["assets/jump.wav"]);
    game.load.audio("fire", ["assets/laser.wav"]);
    game.load.audio("playMusic", ["assets/play_sacrifice.wav"]);
    game.load.audio("menuMusic", ["assets/cat.wav"]);
    game.load.audio("loseMusic", ["assets/lose.wav"]);
    game.load.audio("hit", ["assets/hit.mp3"]);
    game.load.audio("powerup", ["assets/powerup.wav"]);
    game.load.audio("spew", ["assets/spew.wav"]);
    game.load.audio("hardHit", ["assets/hardHit.mp3"]);
    
    game.load.start();
    
}

function loadStart() {
    loadTextObj.setText("Loading...");
}

function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
    loadTextObj.setText("Loading: " + totalLoaded + " of " + totalFiles);
}