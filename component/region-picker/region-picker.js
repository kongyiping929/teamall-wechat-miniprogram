/** ---=*--*=*-=*-=-*-=* ^.^ *---=*--*=*-=*-=-*-=*
 * 省市县三联picker选择组件
 *
 * @author lizus.com
 * @updated 20190429
 *
 * @数据源 https://docs.alipay.com/isv/10327
 *
---=*--*=*-=*-=-*-=* ^.^ *---=*--*=*-=*-=-*-=* */
const ajax = require('../../assets/js/ajax.js');
const orz = require('./orz');
let areaArr='';//省市县数据数组

/** provinces,cities,counties以数组的形式存储省市区数据，单位数组格式为[地方名称，地方名称在areaArr中的索引号] */
let provinces=[];//所有省,ready设定后不变
let cities=[];//城市数据，根据省的选择而变
let counties=[];//县区数据，根据市的选择而变


/** 用于获取某数组中元素的索引号 */
const getIndex=orz.curry(function (arr,name) {
  let idx = Array.prototype.indexOf.call(arr, name);
  return (idx < 1) ? 0 : idx;
});
const getChildren=orz.curry(function (arr,name) {
  for(let k in arr){
    if (arr[k].value == name) return k
  }
});

/** 用于获取省份数据，并传递给全局provinces，此函数只在ready中执行一次就可以了 */
const getProvinces=function () {
    let col=[];
  //console.log(areaArr)
    areaArr.forEach(function (item,index) {
      let num = item.label;
      col.push(num);
    });
    return col;
};
/**
 * 用于获取某一省份下市的数据，返回市名称的列表数组，同时重写全局cities数组
 * @param provinceIndex 省份在provinces数组中索引值
 * @returns {Array}
 */
const getCities=function (provinceIndex) {
  let col = [];
  console.log(areaArr[provinceIndex], provinceIndex)
  let data = areaArr[provinceIndex].children
  provinces = data;
  data.forEach(function (item, index) {
    let num = item.label;
    col.push(num);
    cities = item;
  });
    return col;
};
const getCounties=function (cityIndex) {
  let col=[];
  let data = provinces[cityIndex].children
  data.forEach(function (item, index) {
    let num = item.label;
    col.push(num);
  });
    return col;
};

Component({
    properties:{
        province:{ type: String },
        city:{ type: String },
        county:{ type: String },
        regionId:{ type: Array }
    },
    data:{
        province:'北京',//省
        city:'北京市',//市
        county:'东城区',//县区
        value:[0,0,0],//省，市,县在pickArr中的索引值
        id:[0,0,0],//省，市,县在pickArr中的索引值
        pickArr:[[],[],[]]//省,市,县
    },
    methods:{
        colChange:function (e) {
            let col=e.detail.column;
            let val=e.detail.value;
            let pickArr=this.data.pickArr;
            let value=this.data.value;
            if (col==0) {//用户更换第一列数据，联动二三列，并重置二三列索引为0
                pickArr[1]=getCities(val);
                pickArr[2]=getCounties(0);
                value=[val,0,0];
                this.setData({
                    value:value
                });
            }
            if (col==1) {//用户更换第二列数据，联动第三列，并重置第三列索引为0
                pickArr[2]=getCounties(val);
                value[1]=val;
                value[2]=0;
                this.setData({
                    value:value
                });
            }
          console.log(this.data.value)
            this.setData({
                pickArr:pickArr,
            });
        },
        valChange:function (e) {
          let val=e.detail.value;
          
          let provinces = areaArr[val[0]];
          let citys = provinces.children[val[1]];
          let countys = citys.children[val[2]];
          console.log(provinces.label, citys.label, countys.label)
            let obj={
              province: provinces.label,
              city: citys.label,
              county: countys.label,
              id: [provinces.value, citys.value, countys.value]
            };
            this.setData(obj);
            this.triggerEvent('change',obj);
        },
    },
    ready: function () {
      const { province, city, county, regionId} = this.data;
      console.log( regionId)
      ajax.post('/common/address/province/city/district', {})
        .then(res => {
          areaArr = res.data
          
          let col1 = getProvinces();
          let provinceIndex = getIndex(col1, province);
          let col2 = getCities(provinceIndex);
          let cityIndex = getIndex(col2, city);
          let col3 = getCounties(cityIndex);
          let countyIndex = getIndex(col3, county);
          let value = [provinceIndex, cityIndex, countyIndex];
          
          let pickArr = [col1, col2, col3];
          if (regionId != "") {
            let a = getChildren(areaArr, regionId[0]);
            let b = getChildren(areaArr[a].children, regionId[1]);
            let c = getChildren(areaArr[a].children[b].children, regionId[2]);
            console.log(a,b,c)
            this.valChange({  
              detail: {
                value: [a, b, c]
              }
            })
          }
          console.log(pickArr)
          this.setData({
            pickArr: pickArr,
            value: value
          });
        })
        
    }
});