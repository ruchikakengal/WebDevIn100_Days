var canvas=document.getElementById('canvy');
	var ctx=canvas.getContext('2d');
	var Maze, Player, Cell;
	function X(){
		return parseInt(document.getElementById('xCells').value)
	}
	function Y(){
		return parseInt(document.getElementById('yCells').value)
	}
	function reset(){
		canvas.width+=0;
		ctx=canvas.getContext('2d');
		Maze={pos:[],breaks:[],actualLength:0, exit:{x:0, y:0}, current:new Block(0,0)};
		Player={x:0, y:0, move:{
			left:function(){
				if(Maze.pos[Player.x-1]){
					if(!Maze.pos[Player.x-1][Player.y].isWall) Player.x-=1;
				}
			},
			right:function(){
				if(Maze.pos[Player.x+1]){
					if(!Maze.pos[Player.x+1][Player.y].isWall) Player.x+=1;
				}
			},
			down:function(){
				if(Maze.pos[Player.x][Player.y+1]){
					if(!Maze.pos[Player.x][Player.y+1].isWall) Player.y+=1;
				}
			},
			up:function(){
				if(Maze.pos[Player.x][Player.y-1]){
					if(!Maze.pos[Player.x][Player.y-1].isWall) Player.y-=1;
				}
			}
		}};
		Cell={x:X(), y:Y()};
		Cell.width=canvas.width/Cell.x;
		Cell.height=canvas.height/Cell.y;
		actualLength=0;
	}
	function Block(x, y){
		this.visited=false;
		this.isWall=true;
		this.x=x;
		this.y=y;
	}
    Block.prototype.render=function(){
        if(!this.isWall){
            ctx.fillRect(this.x*Cell.width, this.y*Cell.height, Cell.width, Cell.height);
        }
    };
    Block.prototype.visit=function(){
        this.visited=true;
    };
    Block.prototype.demolish=function(){
        this.isWall=false;
        this.visit();
    };
    Block.prototype.useNeighbours=function(){
        var neighbours=Maze.current.checkNeighbours();
        if(neighbours.length>0){
            var whichBlock=neighbours[Math.floor(Math.random()*neighbours.length)];
            Maze.breaks.push(this);
            this.demolish();
            Maze.pos[this.x+whichBlock.x/2][this.y+whichBlock.y/2].demolish();
            Maze.current=Maze.pos[this.x+whichBlock.x][this.y+whichBlock.y];
            Maze.current.demolish();
            if(Maze.breaks.length>Maze.actualLength){
                Maze.actualLength=Maze.breaks.length;
                Maze.exit.x=Maze.breaks[Maze.breaks.length-1].x;
                Maze.exit.y=Maze.breaks[Maze.breaks.length-1].y;
            }
        }else if(neighbours.length<=0){
            var whichBlock=Maze.breaks[Maze.breaks.length-1];
            Maze.breaks.pop();
            Maze.current=Maze.pos[whichBlock.x][whichBlock.y];
        }else{
            Maze.current=chooseUnvisited();
        }
    };
    Block.prototype.checkNeighbours=function(){
        var visits=[];
        if(Maze.pos[this.x+2]) 			if(!Maze.pos[this.x+2][this.y].visited) visits.push({x:2, y:0});
        if(Maze.pos[this.x-2]) 			if(!Maze.pos[this.x-2][this.y].visited) visits.push({x:-2, y:0});
        if(Maze.pos[this.x][this.y+2]) 	if(!Maze.pos[this.x][this.y+2].visited) visits.push({x:0, y:+2});
        if(Maze.pos[this.x][this.y-2])  if(!Maze.pos[this.x][this.y-2].visited) visits.push({x:0, y:-2});
        return visits;
    };
	function createMaze(){
		for(var i=0; i<Cell.x; ++i){
			Maze.pos.push([]);
			for(var j=0; j<Cell.y; ++j){
				Maze.pos[i].push(new Block(i, j))
			}
		}
		Maze.current=Maze.pos[0][0];
		Maze.current.demolish();
		while(checkUnvisited()){
			Maze.current.useNeighbours();
		}
		render();
	}
	function checkUnvisited(){
		var unvisitedCells=false
		for(var i=0; i<Cell.x; i+=2){
			for(var j=0; j<Cell.y; j+=2){
				if(!Maze.pos[i][j].visited){
					unvisitedCells=true;
					j=Maze.pos[i].length;
					i=Maze.pos.length;
				}
			}
		}
		return unvisitedCells
	}
	function chooseUnvisited(){
		var unvisitedCells=[];
		for(var i=0; i<Maze.pos.length; i+=2){
			for(var j=0; j<Maze.pos[i].length; j+=2){
				if(Maze.pos[i])
					if(Maze.pos[i][j])
						if(!Maze.pos[i][j].visited)
					unvisitedCells.push(Maze.pos[i][j]);
				
			}
		}
		return unvisitedCells[Math.floor(Math.random()*unvisitedCells.length)]
	}
	function renderPlayer(){
		ctx.fillStyle='red';
		ctx.fillRect(Player.x*Cell.width, Player.y*Cell.height, Cell.width, Cell.height);
		ctx.fillStyle='white';
		if(Maze.pos[Player.x-1]) Maze.pos[Player.x-1][Player.y].render();
		if(Maze.pos[Player.x+1]) Maze.pos[Player.x+1][Player.y].render();
		if(Maze.pos[Player.x][Player.y-1]) Maze.pos[Player.x][Player.y-1].render();
		if(Maze.pos[Player.x][Player.y+1]) Maze.pos[Player.x][Player.y+1].render();
	}
	function render(){
		//render maze track
		ctx.fillStyle='white';
		for(var i=0; i<Maze.pos.length; ++i){
			for(var j=0; j<Maze.pos[i].length; ++j){
				Maze.pos[i][j].render();	
			}
		}
		ctx.fillStyle='green';
		ctx.fillRect(Maze.exit.x*Cell.width, Maze.exit.y*Cell.width, Cell.height, Cell.width);
		renderPlayer();
	}
	function generate(){
		reset();
		createMaze();
		render();
	}
	document.getElementById('generate').addEventListener('click',generate);
	var ar=[33,34,35,36,37,38,39,40];
	document.onkeydown = function(evt){
				switch (evt.keyCode) {
	                case 37:Player.move.left();break;
					case 38:Player.move.up();break;
					case 39:Player.move.right();break;
					case 40:Player.move.down();break;
	        	}
	        	renderPlayer();
          var key = e.which;
	      if(ar.indexOf(key) > -1) {
	          e.preventDefault();
	          return false;
	      }
	      return true;
	    	};
  generate();