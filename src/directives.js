export default {
    text: function(el, value) {
        el.textContent = value || '';     
        // this.el.textContent = value || ''
    },
    model: function() {

    },
    on: {
        // 事件, 类似于 v-on-click
        update: function () {
            
        }
    }
}