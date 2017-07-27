(function (exports) {

    var $c = document.createElement.bind(document)

    function GameRenderer(game, $el) {
        this.game = game
        this.$el = $el
        this.$prevIndications = []
        this.$tds = []
        this._init()
    }

    // 初始化游戏
    GameRenderer.prototype._init = function () {
        this._initControl()
        this._initBoard()
    }

    // 初始化棋盘
    GameRenderer.prototype._initBoard = function () {
        // 创建棋盘
        var $table = $c('table'),
        game = this.game
        $table.className = 'map'
        game.board.map.forEach(function (item, indexX) {
            var $tr = $c('tr')
            item.forEach(function (o, indexY) {
                var $td = $c('td')
                $td.dataset.x = indexX
                $td.dataset.y = indexY
                $tr.appendChild($td)
            })
            $table.appendChild($tr)
        })

        // 绑定点击事件
        $table.addEventListener('click', function (event) {
            var $target = event.target
            var $td = findParent($target, $table, function ($node) {
                return $node.tagName === 'TD'
            })
            if ($td) {
                var x = Number($td.dataset.x)
                var y = Number($td.dataset.y)
                game.stepOn(x, y, true)
            }
        })
        $table.classList.add('black-turn')
        this.$el.appendChild($table)
        this.$table = $table
    }

    // 初始化控制台
    GameRenderer.prototype._initControl = function () {
        var $ctlPanel = $c('div'),
            $btnStepOff = $c('button'),
            $btnRegretStepOff = $c('button'),
            $btnRestart = $c('button'),
            game = this.game
        $ctlPanel.className = 'control-panel'
        $btnStepOff.className = 'btn-stepoff'
        $btnRegretStepOff.className = 'btn-regret-stepoff'
        $btnStepOff.innerHTML = '悔棋'
        $btnRegretStepOff.innerHTML = '撤销悔棋'
        $btnRestart.innerHTML = '重新开始'
        $ctlPanel.appendChild($btnRestart)
        $ctlPanel.appendChild($btnStepOff)
        $ctlPanel.appendChild($btnRegretStepOff)
        $btnRestart.addEventListener('click', game.restart.bind(game))
        $btnStepOff.addEventListener('click', game.stepOff.bind(game))
        $btnRegretStepOff.addEventListener('click', game.regretStepOff.bind(game))
        this.$el.appendChild($ctlPanel)
        this.$btnStepOff = $btnStepOff
        this.$btnRegretStepOff = $btnRegretStepOff
        this.$btnStepOff.style.visibility = 'hidden'
        this.$btnRegretStepOff.style.visibility = 'hidden'
    }

    // 清空棋盘DOM
    GameRenderer.prototype.clear = function () {
        this.$tds.forEach(function ($td) {
            $td.innerHTML = ''
            $td.className = ''
        })
    }

    // 渲染游戏控制界面
    GameRenderer.prototype.reRenderControl = function () {
        // css 标志棋盘当前由谁下，配合css hover after 实现下棋位置提示
        var game = this.game,
            clsName = game.getCurrentPlayer().isBlack ? 'black-turn' : 'white-turn',
            clsList = this.$table.classList
        clsList.remove('black-turn', 'white-turn')
        clsList.add(clsName)
    }

    // 渲染单个棋子
    GameRenderer.prototype.reRenderPiece = function (piece, x, y) {
        if (this.$tds.length === 0) {
            // 缓存获取的DOM棋盘，防止多次获取
            this.$tds = [].slice.call(this.$el.querySelectorAll('td'))
        }
        var $td = this.$tds[x * this.game.size + y]
        if (piece) {
            // 渲染下棋
            $td.innerHTML = piece.isBlack ? '⚫' : '⚪'
            $td.className = 'step-on'
        } else {
            // 渲染悔棋
            $td.innerHTML = ''
            $td.className = ''
        }
    }

    // 渲染提示赢棋
    GameRenderer.prototype.reRenderIndications = function (win) {
        var game = this.game,
            currentPlayer = game.getCurrentPlayer()
        this.$prevIndications.forEach(function ($td) {
            $td.classList.remove('win-indication')
        })
        if (!win) {
            this.$prevIndications = currentPlayer.getWinIndications().map(function (pos) {
                var $td = this.$tds[pos.x * this.game.size + pos.y]
                $td.classList.add('win-indication')
                return $td
            }.bind(this))
        }
    }

    exports.GameRenderer = GameRenderer
})(window)
