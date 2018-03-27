import Directives from './directives'
const prefix = 'v-'

export default class Demo {
    constructor(opts = {}) {        
        this.opts = extendObj(opts.methods, opts.data)       
        this.$root = document.getElementById(opts.id)
        // 这里暂时写死
        this.$els = this.$root.querySelectorAll('[v-text], [v-model]')
        let nodeData = parseNodes(this.$els)
        // 内部维护一个 dom element 绑定对象
        this._bindings = makeBindings(this.opts, nodeData)
        log('this _bindings', this._bindings)
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
function makeBindings(opts, nodeData) {
    log('opts', opts)  
    let bindings = {}

    // for (let key in Directives) {
    //     if (Directives.hasOwnProperty(key)) {
    //         log('make', key)
    //         let value = opts[key]    
    //         // bindings[key] = {value: value, event: }
    //     }
    // }

    nodeData.forEach(function(item) {
        for (let key in Directives) {
            let unit = item[key]
            if (Directives.hasOwnProperty(key) && unit != void(0)) {
                let value = opts[unit.value]
                log('valu', value)
                bindings[key] = {value: value, event: unit}           
            }
        }
    })
       
    log('bindings', bindings)
    return bindings
}

// 解析节点，输出所有节点信息列表
// [{'text': {value: 'hello', owner: $el}}, ...]
function parseNodes($els) {
    let attrs = []    
    Array.prototype.forEach.call($els, function(el) {        
        attrs.push(nodeInfo(el))
    })
    // 拍扁数组
    let result = attrs.reduce(function(acc, cur) {
        return acc.concat(cur)        
    })
    log('result', result)
    return result
}

// 输出一个节点的详细信息
// [text: {value: 'hello', owner: $el}, ...]
function nodeInfo($el) {
    let attrs = $el.attributes
    log('attrs', attrs)
    let list = Array.prototype.map.call(attrs, function(attr) {
        let name = rmPrefix(attr.name)
        let obj = {}
        obj[name] = {
            value: attr.value,
            owner: attr.ownerElement,
        }
        return obj
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