(function(exports) {
    
    function extend(dest,src) {
    	for(var property in src) {
    		if(src.hasOwnProperty(property)) {
    			dest[property] = src[property]
    		}
    	}
    }

    function findParent($node,$root,condition) {
    	while($node && ($node != $root)) {
    		if(condition($node)) {
    			return $node
    		}
    		$node = $node.parentNode
    	}
    	return null
    }

    function def(obj,property,fn) {
    	Object.defineProperty(obj, property, {
    		get: function() { 
    			return value
    		},
    		set: function(newValue) { 
    			value = newValue
    			fn()
    		},
    		enumerable: true,
    		configurable: true
    	});
    }
    exports.extend = extend
    exports.findParent = findParent
    exports.def = def
})(window)

