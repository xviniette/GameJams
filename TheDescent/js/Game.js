var gameState = {
	elements:{},
	player:{},
	obstacles:[],
	score:0,
	bestScore:null,
	create(){
		this.score = 0;
		this.bestScore = null;
		var s = localStorage.getItem(bestScoreTag);
		if(s != undefined){
			this.bestScore = s;
		}
		this.obstacles = [];
		this.generateHero();
		this.generateObstacles();

		var score = this.add.text(this.world.width - 10, 10, 'SCORE', { font: '20px Arial', fill: '#FFFFFF'});
		score.anchor.x = 1;
		this.elements.score = score;
	},
	update(data){
		
		this.generateObstacles();
	},
	generateHero(){
		this.player = {
			x:0, 
			y:0, 
			radius:20,
			direction:0,
			speed:2
		}
	},
	generateObstacles(){
		var distance = 400;
		var distanceBetween = 20;
		var width = {
			min:200, 
			max:50
		}

		var generator = {
			min:0.02,
			max:0.08
		}

		if(this.obstacles.length == 0){

			for(var i = -1; i <= 1; i++){
				if(i == 0){
					continue;
				}

				var obstacle = {
					x:i*width,
					y:0,
					radius:20
				}

				obstacle.element = this.add.graphics();
				obstacle.element.lineStyle(0, 0xFFFFFF);
				obstacle.element.drawCircle(obstacle.x, obstacle.y, obstacle.radius * 2);
			}
		}
		while(this.obstacles[this.obstacles.length - 1].y - this.hero.y < distance){
			var last = this.obstacles[this.obstacles.length - 1];


		}
	},
}