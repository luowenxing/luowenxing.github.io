(function(exports) {
	
	function Piece(x,y,isBlack) {
		this.isBlack = isBlack
		this.x = x
		this.y = y
        // 每一个棋子包含赢棋提示的队列
		this.winIndications = [] 
	}

	exports.Piece = Piece
})(window)
