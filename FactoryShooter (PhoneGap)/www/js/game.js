var game = new Phaser.Game(width, height, Phaser.AUTO, 'gamedDiv');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('lose', loseState);

//Start game
game.state.start('boot');