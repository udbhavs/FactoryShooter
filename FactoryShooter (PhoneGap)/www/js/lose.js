var loseState = {
    
    loseMusic: null,
    
    create: function() {
        
        //Background
        var bg = game.add.sprite(0, 0, "sky");
        bg.width = width;
        bg.height = height;
        
        //Text
        var text = game.add.text(0, 0, "You Died!", {
            font: "bold 40px Arial",
            fill: "#000",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
        text.setTextBounds(0, height/2 - 100, width, 50);
        
        //Text Style
        var textStyle = {
            font: "bold 30px Arial",
            fill: "#000" ,
            boundsAlignH: "center",
            boundsAlignV: "middle"
        }
        
        var text2 = game.add.text(0, 0, "Score: " + playerObj.score, textStyle);
        text2.setTextBounds(0, height/2 - 50, width, 40);
        text2.setShadow(3, 3, "rgba(255, 255, 255, 0.5)", 10)
        
        var highscore = getScore() > playerObj.score ? getScore() : playerObj.score;
        setScore(highscore);
        
        var text3 = game.add.text(0, 0, "Highscore: " + highscore, textStyle);
        text3.setTextBounds(0, height/2, width, 40);
        text3.setShadow(3, 3, "rgba(255, 255, 255, 0.5)", 10)
        
        var text4 = game.add.text(0, 0, "Press to go to menu", textStyle);
        text4.setTextBounds(0, height/2 + 50, width, 40);
        text4.setShadow(3, 3, "rgba(255, 255, 255, 0.5)", 10)
        
        this.loseMusic = game.add.audio("loseMusic");
        this.loseMusic.loopFull();
        
    },
    
    update: function() {
        
        if (game.input.mousePointer.isDown || game.input.pointer1.isDown) {
            this.loseMusic.stop();
            game.state.start("menu");
        }
        
    }
    
}