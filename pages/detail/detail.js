//detail.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    motto: 'Hello World',
    contdata:{},
    dqtime:'',
    is_show_btn:false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //转发事件
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '防骗查询小程序',
      path: '/pages/detail/detail?quest_id=' + app.dqdetailId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  go_addlist: function () {
    console.log('添加防骗信息');
    wx.navigateTo({
      url: '../downapp/downapp'
    })
    // wx.showToast({
    //   title: '正在开发中',
    //   icon: 'loading',
    //   duration: 1000
    // })
  },
  onLoad: function (options) {
    // console.log(options)
    if (options.quest_id){
      app.dqdetailId = options.quest_id
      this.setData({
        is_show_btn:true
      })
    }
    var _that=this
    var dqtime = util.formatTime2(new Date)
    _that.setData({
      dqtime: dqtime
    })
    console.log(app.dqdetailId)
    // http://rtd.laoyouta.com/mobile/scam/search_detail?=3
    wx.request({
      url: app.targetUrl +'/mobile/scam/search_detail', //仅为示例，并非真实的接口地址
      data: {
        research_id: app.dqdetailId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res.data)
        res.data.list.score = Math.abs(res.data.list.score)
        switch (res.data.list.text){
          case '0':
            res.data.list.text = '无法判断'
            res.data.list.color = 'C0C0C0'
            break;
          case '1':
            res.data.list.text = '是'
            res.data.list.color = '197927'
            break;
          case '2':
            res.data.list.text = '不是'
            res.data.list.color = 'FF6326'
            break;   
          default :
            console.log('错误') 
            break;
        }

        _that.setData({
          contdata: res.data.list
        })

      }
    })
  }
})
