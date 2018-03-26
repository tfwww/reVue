import Directives from './directives.js'
import Filters from './filters.js'

const prefix = 'v'

export default class Welement {
    constructor(opts = {}) {
        extendObj(opts.data, opts.methods)
        
        this.el = document.getElementById(opts.el)
        this.els = getDirSels(this.el, Directives)        
        // 内部变量
        this._bindings = {}
        this._opts = opts
        // 
        this.data = {}        
        this.init()        
    }

    init() {
        var self = this
        var bindings = self._bindings
        var opts = self._opts

        Array.prototype.forEach.call(this.els, processNode)
        processNode(this.el)
        // 绑定初始数据
        for (var key in bindings) {
            log('key', key)
            self.data[key] = opts.data[key]
            // self.methods[key] = opts.methods[key]
        }

        log('this data init', this.data)        

        function processNode(el) {
            var attrs = cloneAttrs(el.attributes)
            attrs.forEach(function(attr) {
                var directive = parseDirective(attr)
                if (directive) {
                    bindDirective(self, el, bindings, directive)
                }
            })
        }
    }
}

// 辅助函数
// 以指令名为基准，查找相应的指令节点
function getDirSels(root, directives) {
    // 支持的事件
    let event = ['click', 'change', 'blur']
    let dirs = Object.keys(directives)    

    let selectors = dirs.map(function(item) {
        let selector = ''
        if (item != 'on') {
            selector = `[${prefix}-${item}]`
        }        
        return selector
    }).join()
    
    let eventSels = event.map(function(e) {
        return `[${prefix}-on-${e}]`
    }).join()
    // '[v-text],[v-model],[v-on-click],[v-on-change],[v-on-blur]'
    return root.querySelectorAll(selectors + eventSels)
}

// 合并对象，要添加 node 到 base 对象中
function extendObj(base, node) {
    node = node || {}
    for (let key in node) {
        if (node.hasOwnProperty(key)) {            
            base[key] = node[key]
        }        
    }
}

/**
 * 
 * @param {node array like} attrs 一个节点的所有属性
 * @returns {array} list 一个数组，元素为 {name: 属性名, value: 属性值}
 */
function cloneAttrs(attrs) {
    var list = Array.prototype.map.call(attrs, function(attr) {
        return {
            name: attr.name,
            value: attr.value
        }
    })    
    return list
}

/**
 * 
 * @param {object} attr {name: 属性名, value: 属性值}
 */
function parseDirective(attr) {
    var name = attr.name
    var value = attr.value

    // 解析出指令内容
    var barInx = value.indexOf('|')
    var key = barInx === -1 ? value.trim() : value.slice(0, barInx).trim()
    var filter = barInx === -1 ? null : value.slice(barInx + 1).split('|').map(function(item){
        return item.trim()
    })

    // 解析指令名 key
    var noprefix = name.slice(prefix.length + 1)
    var symInx = noprefix.indexOf('-')
    var dirName = symInx === -1 ? noprefix : noprefix.slice(0, symInx)
    var def = Directives[dirName]
    // 取第二个 - 的参数, 事件
    var arg = symInx === -1 ? null : noprefix.slice(symInx + 1)
    return def === undefined ? null : {
        attr: attr,
        key: key,
        filter: Filters[filter],
        definition: def,
        argument: arg,
        update: typeof def === 'function' ? def : def.update
    }
}

// 将指令放到 bindings 对象中
function bindDirective(welement, el, bindings, directive) {
    el.removeAttribute(directive.attr.name)
    var key = directive.key
    var binding = bindings[key]
    
    if (!binding) {
        binding = {
            value: undefined,
            directives: []
        }
        bindings[key] = binding
    }

    directive.el = el
    binding.directives.push(directive)    
    var data = welement.data
    if (!data.hasOwnProperty(key)) {
        bindAccessor(welement, key, binding)
    }
}

function bindAccessor(obj, key, binding) {    
    Object.defineProperty(obj.data, key, {
        get: function() {
            return binding.value
        },
        set: function(newValue) {            
            var oldValue = binding.value
            if (oldValue != newValue) {
                binding.value = newValue
                binding.directives.forEach(function(directive) {                    
                    if (newValue && directive.filter) {
                        newValue = directive.filter(newValue)
                    }
                    directive.update(newValue)
                })
            }
        }
    })
}
