(function(exports) {
	
	function Player(board,isBlack) {
		this.board = board
		this.isBlack = isBlack
		this.pieces = []
        this.regretPieces = []
	}

    // 清空玩家棋子信息
    Player.prototype.clear = function() {
        this.pieces = []
        this.regretPieces = []
    }

    // 落子
	Player.prototype.stepOn = function(x,y) {
		var piece = new Piece(x,y,this.isBlack)
		piece = this.board.stepOn(piece)
		if(piece) {
			this.pieces.push(piece)
		}
		return piece
	}

    // 悔棋
	Player.prototype.stepOff = function() {
		var piece = this.pieces.pop()
        this.regretPieces.push(piece)
        this.board.stepOff(piece)
        return piece
	}

    // 取消悔棋
	Player.prototype.regretStepOff = function() {
		var piece = this.regretPieces.pop()
        this.pieces.push(piece)
        this.board.stepOn(piece)
        return piece
	}

    // 获取当前所有的赢棋提示所在的点的队列
	Player.prototype.getWinIndications = function() {
		return this.pieces.reduce(function(sum,piece) {
			return sum.concat(piece.winIndications) 
		},[])
	}

	exports.Player = Player
})(window)
