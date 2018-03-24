export default {
    text: function(value) {
        this.el.textContent = value || '';        
    },
    model: function() {

    },
    on: {
        // 事件, 类似于 v-on-click
        update: function (handler) {            
            var event = this.argument            
            this.el.addEventListener(event, handler)
        }
    }
}