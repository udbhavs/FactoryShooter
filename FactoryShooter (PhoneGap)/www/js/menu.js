var menuState = {
    
    menuMusic: null,
    
    create: function() {
        
        //When game restarts
        resetValues();
        
        //Play menu music
        this.menuMusic = game.add.audio("menuMusic");
        this.menuMusic.loopFull();
        
        //Background image
        var bg = game.add.sprite(0, 0, "country");
        bg.width = width;
        bg.height = height;
        
        //Menu text
        var text = game.add.text(0, 0, "Press to play", {
            font: "bold 40px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
        
        text.setTextBounds(0, height/4, width, height/10);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        
        var text2 = game.add.text(0, 0, "Made by Udbhav Saxena", {
            font: "bold 40px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
        
        text.setTextBounds(0, (height * 2)/4, width, height/10);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        
    },
    
    update: function() {
        
        if (game.input.mousePointer.isDown || game.input.pointer1.isDown) {
            this.menuMusic.stop();
            game.state.start("play");
        }
        
    }
    
}

function resetValues() {
playerObj = {
    speedLeft: -200,
    speedRight: 200,
    speedUp: -300,
    bounceY: 0.4,
    gravityY: 700,
    health: 100,
    prevFactoryHit: 0,
    hitRate: 400,
    score: 0,
    hitIncrement: 20
}
var factoryObj = {
    health : 100,
    prevSpew: 0,
    spewRate: 500,
    maxFire: 15,
    fireGas: {
        speedX: -300,
        damage: 10
    }
}

}