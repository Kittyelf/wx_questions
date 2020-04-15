//index.js
//获取应用实例
const app = getApp()
// var feedbackApi = require('../../template/showToast/showToast');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    newKey:[],
    defaultKey:'请输入搜索内容',
    hisKey:[],
    serText: '',
    serText_yz:'',//搜索内容高亮用
    pageShow:{
      main: true,
      list:false,
      noresult: false
    },
    listCont: [],
    pages:{
      dq:0,
      jz:1,
      zt: false,
      zts:false
    }
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
  // 滑动事件
  load_data: function () {
    var _that=this
    var datapage = this.data.pages
    if (datapage.zt){
      console.log('已加载完数据或正在加载中。。。')
      return false
    }
    _that.setData({
      'pages.zt':true
    })
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 5000
    })
    console.log('ajax加载数据...');
    _that.searchTap()


    
  },
  //事件处理函数
  gologs: function () {
    
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  goDetail: function (e) {
    //文章id
    var c_id = e.currentTarget.dataset.id
    app.dqdetailId = c_id
    wx.navigateTo({
      url: '../detail/detail'
    })
  },
  serinput_fn:function(e){
    // console.log(e)
    this.setData({
      serText: e.detail.value
    })
  },
  clearStorage:function(){
    var _that=this;
    wx.removeStorage({
      key: 'bxy_fpcxq',
      success: function (res) {
        _that.setData({
          hisKey:[]
        })
        wx.showToast({
          title: '清空成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  click_ser:function(e){
    var ind = e.target.dataset.id
    var btn_type = e.target.dataset.type
    if(btn_type == 'old'){
      this.setData({
        serText: this.data.hisKey[ind]
      })
    }else if(btn_type == 'new'){
      this.setData({
        serText: this.data.newKey[ind].new_name
      })
    }
    this.searchTap();
    // console.log(this);
  },
  del_serText:function(){
    this.setData({
      pageShow: {
        main: true,
        list: false,
        noresult: false
      },
      serText:'',
      listCont:[],
      pages:{
        dq: 0,
        jz: 1,
        zt: false,
        zts:false
      }
    })
  },
  sear_btn:function(){
    this.setData({
      listCont: [],
      pages: {
        dq: 0,
        jz: 1,
        zt: false,
        zts: false
      }
    })
    this.searchTap();
  },
  searchTap:function(){
    if(this.data.serText==''){
      if (this.data.defaultKey =='请输入搜索内容'){
        // feedbackApi.showToast({ title: '请输入搜索内容' })
        wx.showToast({
          title: '内容为空',
          icon: 'loading',
          duration: 1000
        })
        return false
      }
      this.setData({
        serText: this.data.defaultKey
      })
     
    }
    this.setData({
      serText_yz: this.data.serText
    })
    
    var yuan_data = this.data.hisKey
    var yuan_wz = yuan_data.indexOf(this.data.serText);
    if (yuan_wz >= 0) {
      yuan_data.splice(yuan_wz, 1);
    }
    yuan_data.unshift(this.data.serText)
    this.setData({
      hisKey: yuan_data
    })
    var str_hiskey = JSON.stringify(this.data.hisKey)
    wx.setStorageSync('bxy_fpcxq', str_hiskey )

    // wx.showToast({
    //   title: 'ajax获取数据接口',
    //   icon: 'loading',
    //   duration: 50
    // })
    var _that = this;
    _that.setData({
      pageShow:{
        main: false,
        list: true,
        noresult: false
      }
    })
    wx.request({
      url: app.targetUrl+'/mobile/scam/scam_search', //仅为示例，并非真实的接口地址
      data: {
        search_keyword:_that.data.serText,
        page:_that.data.pages.jz
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideToast()
        //加载完毕，page+1
        _that.setData({
          'pages.jz': _that.data.pages.jz * 1 + 1,
          'pages.zt':false
        })
        // console.log(res)
        var ajaxdata=res.data
        var sertxt = _that.data.serText
        var reg = new RegExp('(' + sertxt + ')');
        

        for (var i = 0; i < ajaxdata.list.length; i++) {
          for (var j = 0; j < ajaxdata.list[i].new_keyword.length; j++) {
            //对关键词标红
            ajaxdata.list[i].new_keyword[j] = ajaxdata.list[i].new_keyword[j].replace(reg, '---$1---')
            ajaxdata.list[i].new_keyword[j] = ajaxdata.list[i].new_keyword[j].split('---')
            // ajaxdata.list[i].new_keyword[j] = ajaxdata.list[i].new_keyword[j].replace(reg, '<span class="high">$1</span>')
            // console.log(ajaxdata.list[i].new_keyword[j]);
          }
          //对标题标红
          // ajaxdata.list[i].research_title = ajaxdata.list[i].research_title.replace(reg, '<span style="font-size: 20px;" class="high">$1</span>');
          ajaxdata.list[i].research_title = ajaxdata.list[i].research_title.replace(reg, '---$1---');
          ajaxdata.list[i].research_title = ajaxdata.list[i].research_title.split('---');
          ajaxdata.list[i].score = Math.abs(ajaxdata.list[i].score)
        }
        _that.setData({
          listCont: _that.data.listCont.concat(ajaxdata.list)
        })

        if (_that.data.pages.jz == 2) {
          _that.searchTap()
        }
        if (ajaxdata.list.length == 0) {
          _that.setData({
            'pages.zt': true,
            'pages.zts': true
          })
          if(_that.data.pages.jz==2){
            _that.setData({
              pageShow: {
                main: false,
                list: false,
                noresult: true
              }
            })
          }
        }
        
        
      }
    })
    
  },
  go_addlist: function () {
    // console.log('添加防骗信息--正在开发中...');
    wx.navigateTo({
      url: '../downapp/downapp'
    })
    
  },
  onLoad: function (options) {
    
    // console.log('加载完成')
    var _that = this
    
    //获得登录用户信息---start
    if (app.globalData.userInfo) {
      _that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (_that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        _that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          _that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //end


    //加载最新关键词
    wx.request({
      url: app.targetUrl+'/mobile/scam/scam_new', 
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res)
        var data1=res.data

        try {
          _that.setData({
            defaultKey: data1.default_scam.new_name //默认查询关键词
          })
        } catch (e) {
          console.log('接收默认搜索值出错');
        }

        _that.setData({
          newKey: data1.list
        })
      }
    })
    

    //加载历史关键词
    var his_data = '[]'
    wx.getStorage({
      key: 'bxy_fpcxq',
      success: function (res) {
        his_data = res.data
        his_data = JSON.parse(his_data);
        _that.setData({
          hisKey: his_data
        })
      //  console.log(his_data)
      }
    })
    // console.log(his_data)
    //防止第一次加载时无数据，默认为[]
    his_data=JSON.parse(his_data);
    _that.setData({
      hisKey:his_data
    })
  },
  getUserInfo:function(e){
    console.log('log.js--getUserInfo-1')
    console.log('用户信息-头像和昵称')
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
  
})
