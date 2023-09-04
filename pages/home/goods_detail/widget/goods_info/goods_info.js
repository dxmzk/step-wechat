/**
 * Author: Meng
 * Date: 2022-04
 * 商品规格详情弹窗
 */
Component({
    /**
     * [{label: '', value: ''}]
     */
    properties: {
        list: {
            type: Array,
            value: []
        }
    },

    data: {
        animData: {},
    },
    lifetimes: {
        attached: function () {
            // 在组件实例进入页面节点树时执行
        },
        ready: function() {
            this.createAnim()
        },
        detached: function () {
            // 在组件实例被从页面节点树移除时执行
        },
    },
    methods: {
        //
        createAnim: function (num) {
            let that = this;
            let animation = wx.createAnimation({
                duration: 500,
                timingFunction: 'ease',
            })
            animation.translate(0, 0).step({ duration: 600 });
            that.setData({
                animData: animation.export()
            });
        },
        // 
        onEventBack: function (status, data = {}) {
            this.triggerEvent('click', {
                status,
                data
            })
        },
        // 
        onClose: function() {
            this.triggerEvent('onClose')
        },
    }
})
