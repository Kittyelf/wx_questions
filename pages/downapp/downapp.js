//detail.js
//获取应用实例
const app = getApp()

Page({
  data: {
    contdata:{}
  },
  set_cont:function(){
    wx.setClipboardData({
      data: 'http://www.laoyouta.com/h5/user/transferRegister.php',
      success: function (res) {
        console.log('设置成功')
        // wx.getClipboardData({
          // success: function (res) {
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 1000
            })
            // console.log('获取成功222')
            // console.log(res.data) // data
          // }
        // })
      },
      fail:function(){
        console.log('设置失败')
      }
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
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  get_cont: function () {
    wx.getClipboardData({
      success: function (res) {
        console.log('获取成功111')
        // console.log(res.data)
      }
    })
  },
  saveimg:function(){
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: function (res) {
        wx.downloadFile({
          url: 'https://rtd.laoyouta.com/h5/cyproject/img/code1.png',
          success: function (res) {
            // console.log(res)
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (res) {
                // console.log(res)
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 1000
                })
              },
              fail: function (res) {
                wx.getSetting({
                  success(res) {
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                      wx.showModal({
                        title: '您取消了授权,短时间无法保存图片',
                        content:'您可以前往小程序中删除该小程序重新打开进行授权',
                        showCancel: false,
                        success: function (res) {
                          if (res.confirm) {
                            console.log('用户点击确定')
                          } else if (res.cancel) {
                            console.log('用户点击取消')
                          }
                        }
                      })
                    }
                  }
                })
                
              }
            })
          },
          fail: function () {
            console.log('fail')
          }
        }) 
      },
      fail: function (res) {
        console.log('取消保存图片')
      }
    })
    return
    
  },
  onLoad: function () {
    var _that=this
    
  }
})
