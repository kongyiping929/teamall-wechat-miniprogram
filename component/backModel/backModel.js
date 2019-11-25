Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModalDelive: Boolean,
    showModalRefund: Boolean,
    showModalPay: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    isHiddenMask: false,
    company:"",
    orderNo:"",
    refundValue:"",
    payValue:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    companyInput(e){
      this.setData({ company: e.detail.value})
    },
    orderNoInput(e){
      this.setData({ orderNo: e.detail.value})
    },
    refundInput(e){
      this.setData({ refundValue: e.detail.value})
    },
    payInput(e){
      this.setData({ payValue: e.detail.value})
    },
    typeActive(e){
      const { typeList} = this.data;
      let list = typeList;
      list.forEach((v,i)=>{
        v.active = false
      })
      list[e.target.dataset.index].active = true;
      this.setData({ typeList: list, showType: e.target.dataset.index+1 })
    },
    // 单击了 actionsheet 事件
    Sure: function (e) {
      // triggerEvent函数接受三个值：事件名称、数据、选项值
      const { showModalDelive, showModalPay, orderNo, company, refundValue, payValue} = this.data;
      if (showModalDelive){
        this.triggerEvent('deliverEdit', { orderNo, company })
      }
      if (showModalPay){
        console.log(payValue)
        if (!payValue) return wx.showToast({
          title: "请输入价格",
          icon: 'none',
          duration: 2000
        });
        this.triggerEvent('payEdit', { payValue })
      }
      
    },

    // 取消 actionsheet 事件
    cancel: function () {
      this.triggerEvent('hideModel', {})
    },
    // 开关
    switchChange: function () {
      this.setData({ checked: !this.data.checked })
    },

    /// 创建 actionsheet 动画
    createAnimation: function (state) {
      // 1 创建动画实例
      var animation = wx.createAnimation({
        duration: 200, // 动画时长
        timingFunction: "linear", // 线性
        delay: 1, // 延时执行时长
      });

      // 2 这个动画实例赋给当前的动画实例
      this.animation = animation;

      // 3 计算高度，并赋值
      let maskHeight = this.data.itemData.length * itemHeight + bottomHeight + (this.data.itemData.length - 1) * dividingLineHeight;
      animation.translateY(maskHeight).step();

      // 4 导出动画对象赋给数据对象储存
      if (!state) {
        this.setData({
          animationData: animation.export(),
          isHiddenMask: state
        });
      } else {
        this.setData({
          animationData: animation.export()
        });
      }

      // 5 设置定时器到指定时候后，执行第二组动画
      setTimeout(function () {
        animation.translateY(0).step();

        // 显示/关闭抽屉
        if (!state) {
          this.setData({
            animationData: animation.export()
          });
        } else {
          this.setData({
            animationData: animation.export(),
            isHiddenMask: state
          });
        }
      }.bind(this), 200);
    },

    /// 占位事件，不用管理
    prev: function () {
      // 截取蒙层下的滑动事件，蒙层下的view不能滑动
    }
  }
})
