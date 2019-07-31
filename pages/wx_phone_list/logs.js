//logs.js
const app = getApp()
const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18
Page({
  data: {
    toView:'',
    logs: [],
    scrollTop:0,
    HOT_NAME:'热',
    HOT_SINGER_LEN:2,
    listHeight:[],
    currentIndex:0,
    fixedTitle:'热',
    fixedTop:0,
    list:[
      {
        "index": "X",
        "name": "薛之谦",
        "img":''
      },
      {
          "index": "Z",
          "name": "周杰伦",
          "img":''
      },
      {
          "index": "B",
          "name": "BIGBANG (빅뱅)",
          "img":''
      },
      {
          "index": "C",
          "name": "陈奕迅",
          "img":''
      },
      {
          "index": "L",
          "name": "林俊杰",
          "img":''
      },
      {
          "index": "A",
          "name": "1Alan Walker (艾伦·沃克)",
          "img":''
      },
      {
        "index": "A",
        "name": "2Alan Walker (艾伦·沃克)",
        "img": ''
      },
      {
        "index": "Y",
        "name": "Ymm",
        "img": ''
      },
      {
        "index": "E",
        "name": "Ymm",
        "img": ''
      },
      {
        "index": "W",
        "name": "Way",
        "img": ''
      },
      {
        "index": "B",
        "name": "BB",
        "img": ''
      },
    ]
  },
  onLoad: function () {
    var that = this,
        list = that.data.list;
    wx.hideLoading()
    this.setData({
      logs: this._normalizeSinger(list)
    })
    console.log(this.data.logs,'logs');
    
   
  },
  onReady:function(){
    this._calculateHeight()
  },
  _normalizeSinger(list) {
    //歌手列表渲染
    let map = {
      hot: {
        title: this.data.HOT_NAME,
        items: []
      }
    }
    list.forEach((item, index) => {
      if (index < this.data.HOT_SINGER_LEN) {
        map.hot.items.push({
          name: item.name,
          avatar:item.img
          })
      }
      const key = item.index
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push({
        name: item.name,
        avatar: item.img
      })
    })
    // 为了得到有序列表，我们需要处理 map
    let ret = []
    let hot = []
    for (let key in map) {
      let val = map[key]
      if (val.title.match(/[a-zA-Z]/)) {
        ret.push(val)
      } else if (val.title === this.data.HOT_NAME) {
        hot.push(val)
      }
    }
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return hot.concat(ret)
  },
  scroll :function(e) {
    var newY = e.detail.scrollTop;
    this.scrollY(newY);
  },
  scrollY(newY) {
    const listHeight = this.data.listHeight
    // 当滚动到顶部，newY>0
    if (newY == 0 || newY < 0) {
      this.setData({
        currentIndex:0,
        fixedTitle:''
      })
      return
    }
    // 在中间部分滚动
    for (let i = 0; i < listHeight.length - 1; i++) {
      let height1 = listHeight[i]
      let height2 = listHeight[i + 1]
      if (newY >= height1 && newY < height2) {
        this.setData({
          currentIndex:i,
          fixedTitle:this.data.logs[i].title
        })
        this.fixedTt(height2 - newY);
        return
      }
    }
    // 当滚动到底部，且-newY大于最后一个元素的上限
    console.log(listHeight,'listHeight=scrollY');
    
    this.setData({
      currentIndex: listHeight.length - 2,
      fixedTitle: this.data.logs[listHeight.length - 2].title
    })
    console.log(this.data.currentIndex, 'currentIndex');

  },
  fixedTt(newVal) {
    let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
    if (this.data.fixedTop === fixedTop) {
      return
    }
    this.setData({
      fixedTop:fixedTop
    })
  },
  _calculateHeight() {
    let lHeight = [],
        that = this;
    var height = 0;
    lHeight.push(height);
      var query = wx.createSelectorQuery();
      query.selectAll('.list-group').boundingClientRect(function(rects){
        console.log('rects', rects)
        let rect = rects,
         len = rects.length;
        for (let i = 0; i < len; i++) {
          height += rect[i].height;
          lHeight.push(height)
        }
        console.log('rects', len, lHeight)
        
      }).exec();
   
    
    var calHeight = setInterval(function(){
      if (lHeight != [0]) {
        that.setData({
          listHeight: lHeight
        });
        clearInterval(calHeight);
        console.log(that.data.listHeight, 'listHeight')
      } 
    },1000)



  },
  scrollToview(e){
    var id = e.target.dataset.id
    console.log(id,'id');
    
    if (id == '热') {
      this.setData({
        scrollTop:0,
        fixedTitle:'热'
      })
    } else {
      this.setData({
        toView: id
      })
    }
    
  }
})
