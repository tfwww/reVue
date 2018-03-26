import Directives from './directives'
const prefix = 'v-'

export default class Demo {
    constructor(opts = {}) {
        this.opts = extendObj(opts.methods, opts.data)        
        // 内部维护一个 dom element 绑定对象
        this._bindings = makeBindings(this.opts)
        this.$root = document.getElementById(opts.id)
        // 这里暂时写死
        this.$els = this.$root.querySelectorAll('[v-text]')
        parseNodes(this.$els)
        this.init()
    }

    init() {
        // 对 this.opts 进行存取器绑定
        // bindAccessor(this._bindings, this.opts)
    }
}

// 合并对象
function extendObj(base, node) {    
    for (let key in base) {
        if (base.hasOwnProperty(key)) {
            node[key] = base[key]
        }
    }
    return node
}

// 存取器设置
function bindAccessor(bindings, opts) {    
    for (let key in opts) {
        if (opts.hasOwnProperty(key)) {
            Object.defineProperty(opts, key, {
                get: function() {
                    return bindings[key]
                },         
                set: function(newValue) {            
                    log('set', newValue)
                    // 这里借助 bindings 更改 dom 视图
                    // bindings[key] = 
                }
            })
        }
    }    
}

// 构造一个对象，联系 dom 和元素的
/**
 * 
 * @returns {object} 
 * {
 *    text: {value: 'hello', event: []} 
 * }
 */
function makeBindings(opts) {
    log('opts', opts)  
    let bindings = {}

    for (let key in Directives) {
        if (Directives.hasOwnProperty(key)) {
            log('make', key)
            let value = opts[key]    
            bindings[key] = {value: value, event: []}
        }
    }
       
    log('bindings', bindings)
    return bindings
}

// 解析节点，输出节点信息列表
// [{'text': 'hello'}, ...]
function parseNodes($els) {
    var attrs = []
    Array.prototype.forEach.call($els, function(el) {
        nodeInfo(el)
        // attrs.push(nodeInfo(el))
    })
    log('attrs', attrs)
}

// 输出一个节点的详细信息
// {name: 'text', value: 'hello', owner: $el}
function nodeInfo($el) {
    let attrs = $el.attributes
    log('attrs', attrs)
    let list = Array.prototype.map.call(attrs, function(attr) {
        let name = rmPrefix(attr.name)        
        return {
            owner: attr.ownerElement,            
        }
    })  
    log('list', list)  
    return list
}

// 去掉 'v-'
function rmPrefix(str) {
    let prefixStart = str.indexOf(prefix) > -1 ? true : false
    let result = ''
    
    if (prefixStart) {
        result = str.replace(prefix, '')
    }
    return result
}