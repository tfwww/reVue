import Directives from './directives.js'

// module.exports = 'reVue';
export default class Welement {
    constructor(opts = {}) {
        this.el = document.getElementById(opts.el)
        this.els = getDirSels(this.el, Directives)        
        getDirSels(Directives)
    }
}

// 辅助函数
// 以指令名为基准，查找相应的指令节点
function getDirSels(root, directives) {
    // 支持的事件
    let event = ['click', 'change', 'blur']
    let dirs = Object.keys(directives)
    let prefix = 'v'

    let selectors = dirs.map(function(item) {
        var selector = ''
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
