
"use strict";

Component({
    options: {
        addGlobalClass: true
    },
    properties: {
        extClass: {
            type: String,
            value: ''
        },
        list: {
            type: Array,
            value: []
        },
        current: {
            type: Number,
            value: 0
        }
    },
    methods: {
        tabChange: function tabChange(e) {
            let index = e.currentTarget.dataset.index;
            let that = this;
            if (index === that.data.current) {
                return;
            }
            that.setData({
                current: index
            });
            that.triggerEvent('change', { index: index, item: that.data.list[index] });
        }
    }
});