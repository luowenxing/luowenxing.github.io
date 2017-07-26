(function(exports) {
	
	var GameStatus = {
		End:'End',
		Playing:'Playing',
		Waiting:'Waiting'
	}
	var defaultOptions = {
		size:20
	}

	function Game(options) {
		var opt = {}
		extend(opt,defaultOptions)
		extend(opt,options)
		this.size = opt.size
		this.board = new Board(opt.size)
		this.status = GameStatus.Playing
		// 两个玩家
		this.players = [new Player(this.board,true),new Player(this.board,false)]
		// dom渲染器
		this.renderer = new GameRenderer(this,opt.el)
        // 棋盘变化的时候渲染棋盘控制台
		def(this,'stepsCount',this.renderer.reRenderControl.bind(this.renderer))
		this.stepsCount = 0
	}

    // 是否游戏中
	Game.prototype.isPlaying = function() {
		return this.status === GameStatus.Playing
	}

    // 当前下棋的玩家
	Game.prototype.getCurrentPlayer = function() {
		var turn = this.stepsCount % 2 
		return this.players[turn]
	}

    // 上一步的玩家
	Game.prototype.getPrevPlayer = function() {
		var turn = ( this.stepsCount - 1 ) % 2 
		return this.players[turn]
	}

    // 玩家下棋队列的总长度
	Game.prototype.totalPieces = function() {
		return this.players[0].pieces.length + this.players[1].pieces.length
	}

    // 玩家悔棋队列的总长度
	Game.prototype.totalRegretPieces = function() {
		return this.players[0].regretPieces.length + this.players[1].regretPieces.length
	}

    // 重新开始游戏
    Game.prototype.restart = function() {
        this.stepsCount = 0
        this.status = GameStatus.Playing
        this.board.clear()
        this.players.forEach(function(player){
            player.clear()
        })
        this.renderer.clear()
    }

	// 点击事件，下一步棋
	Game.prototype.stepOn = function(x,y) {
		// 只有在游戏中时才能下棋
		if(this.isPlaying()) {
			var player = this.getCurrentPlayer()
			var piece = player.stepOn(x,y)
            // 清空悔棋
            this.players.forEach(function(player){
                player.regretPieces = []         
            })
			// 点击空白处，成功走了一步棋
			if(piece) {
				this.stepsCount ++
				this.renderer.reRenderPiece(piece,x,y)
                // 判断是否赢了
				if(this.board.checkWin(piece)) {
					setTimeout(function() {
						alert( (piece.isBlack ? 'Black' : 'White') + 'Win')
					},100)
					this.status = GameStatus.End
					this.renderer.reRenderIndications(true)
				} else {
					this.renderer.reRenderIndications(false)
				}
				
			}
		}
	}

    // 悔棋
    Game.prototype.stepOff = function() {
        if(this.isPlaying()) {
            var player = this.getPrevPlayer()
            var piece = player.stepOff()
            this.stepsCount -- 
            this.renderer.reRenderPiece(null,piece.x,piece.y)
            this.renderer.reRenderIndications(false)
        }
    }

    // 撤销悔棋
    Game.prototype.regretStepOff = function() {
        if(this.isPlaying()) {
        	var player = this.getCurrentPlayer()
            var piece = player.regretStepOff()
            this.stepsCount ++ 
            this.renderer.reRenderPiece(piece,piece.x,piece.y)
            this.renderer.reRenderIndications(false)
        }
    }

	exports.Game = Game
})(window)
