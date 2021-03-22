const app = getApp();
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        btndisplay: "none"
    },
    onLoad: function () {
        setTimeout(function(){
        this.setData({
            btndisplay: "block"
        })
        }.bind(this),1000)
        var that = this;
        // 查看是否授权
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            //从数据库获取用户信息
                            that.queryUsreInfo();
                            //用户已经授权过
                            wx.switchTab({
                                url: '../../homePage/homePage'
                            })
                            // //授权成功后，跳转进入小程序首页
                            // wx.redirectTo({
                            //     url: '../prePage2/prePage2'
                            // })
                        }
                    });
                }
            }
        })
    },
    bindGetUserInfo: function (e) {
        let that=this;
        that.setData({ishided: 0.5});
        setTimeout(function() {
            that.setData({ishided: 1});
        }.bind(this),100);

        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            //插入登录的用户的相关信息到数据库
            wx.request({
                url: app.globalData.urlPath + 'user/add',
                data: {
                    openid: getApp().globalData.openid,
                    nickName: e.detail.userInfo.nickName,
                    avatarUrl: e.detail.userInfo.avatarUrl,
                    province:e.detail.userInfo.province,
                    city: e.detail.userInfo.city
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    //从数据库获取用户信息
                    that.queryUsreInfo();
                    console.log("插入小程序登录用户信息成功！");
                }
            });
            //授权成功后，跳转进入小程序首次登录界面
            wx.redirectTo({
              url: '../prePage2/prePage2'
            })
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title:'警告',
                content:'您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel:false,
                confirmText:'返回授权',
                success:function(res){
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”')
                    } 
                }
            })
        }
    },
    //获取用户信息接口
    queryUsreInfo: function () {
        wx.request({
            url: app.globalData.urlPath + 'user/userInfo',
            data: {
                openid: app.globalData.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res.data);
                getApp().globalData.userInfo = res.data;
            }
        });
    },

})