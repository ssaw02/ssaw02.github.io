var data, head = new Vue();
var cartItems = window.sessionStorage.getItem(['cart']) == null ? [] : window.sessionStorage.getItem(['cart']).split(',');

// header components
var searchContent = Vue.extend({
  template: '<div class="headerSearchDiv"><input type="text" class="searchText"/><input type="button"  class="searchButton" value="search"/></div>'
});
var minicartContent = Vue.extend({
  props: ['product'],
  template: '<li class="minicartProduct"><img class="minicartImage" :src="product.imageUrl"><div class="productName">{{product.name}}</div><div class="productPrice">価格：¥{{product.price}}</div></li>'
});
var cartContent = Vue.extend({
  props: {
    'items': Array,
    'qty': Number
  },
  template: '<div class="headerCartDiv"><a href="cart.html"><img class="cartIcon" src="img/cart.png" alt="カートを見る"><span class="minicartQuantity" v-if="qty">{{qty}}</span></a><div class="minicartContent"><ul class="minicartProducts"><minicart-content v-for="item in items" :key="item.id" v-if="qty" v-bind:product="item"></minicart-content></ul><div class="minicartTotal"><a href="cart.html">カートを見る</a></div></div></div>',
  components: {
    'minicart-content': minicartContent
  }
});
var headerContent = Vue.extend({
  props: ['items'],
  template: '<div class="headerTopDiv"><search-content></search-content><cart-content v-bind:items="items" v-bind:qty="items.length"></cart-content></div>',
  components: {
    'search-content': searchContent,
    'cart-content': cartContent
  }
});
Vue.component('logo-content', {
  template: '<h2 class="primaryLogo"><a href="index.html"><img class="topIcon" src="img/logo_m.png" title="UPLOAD online shop ホーム" alt="topに戻る"></a></h2>'
});

// footer components
var linksContent = Vue.extend({
  template: '<ul class="links"><li><a class="arrow arrow_right-right" href="https://www.upload-gp.co.jp/" target="_blank">UPLOAD 公式HP</a></li><li><a class="arrow arrow_right-right" href="https://www.upload-gp.co.jp/privacy.html" target="_blank">プライバシーポリシー</a></li><li><a class="arrow arrow_right-right" href="https://www.upload-gp.co.jp/outline.html" target="_blank">会社概要</a></li><li><a class="arrow arrow_right-right" href="https://www.upload-gp.co.jp/outline.html#contact" target="_blank">お問い合わせ</a></li></ul>'
});
var footerContent = Vue.extend({
  template: '<div class="footerInnerDiv"><links-content></links-content></div>',
  components: {
    'links-content': linksContent
  }
});

$(function() {

  // header new Vue
  head = new Vue({
    el: "header",
    components: {
      'header-content': headerContent
    },
    data: {
      cartItems: []
    }
  });

  // footer new Vue
  new Vue({
    el: "footer",
    components: {
      'footer-content': footerContent
    }
  });

  data = new Vue({
    el: '#container',
    data: {
      message: 'Hello Vue!',
      json: {},
      param: {}
    }
  });

  $.ajaxSetup({async: false});
  // https://dl.dropboxusercontent.com/s/230jd5l2ja1wutr/data.json
  $.getJSON("data.json" , function(jsonData) {
    data.json = jsonData;
    for(var i=0; i < cartItems.length; i++){
      head.cartItems.push(jsonData.product[cartItems[i]]);
    }
    if(head.cartItems.length > 0){
      minicart.init();
    }
  })
  .success(function(json) {
    console.log("成功");
  })
  .error(function(jqXHR, textStatus, errorThrown) {
    console.log("エラー：" + textStatus);
    console.log("テキスト：" + jqXHR.responseText);
  })
  .complete(function() {
    console.log("完了");
  });
  $.ajaxSetup({async: true});

});

var minicart = {
  init: function () {
    this.$el = $('.headerCartDiv');
    this.$content = this.$el.find('.minicartContent');

    // events
    this.$el.on('mouseenter', function () {
      if (this.$content.not(':visible')) {
        this.slide();
      }
    }.bind(this));

    this.$content.on('mouseenter', function () {
      timer.clear();
    }).on('mouseleave', function () {
      timer.clear();
      timer.start(3000, this.close.bind(this));
    }.bind(this));
  },
  show: function () {
    var that = this;
    timer.start(500, function(){
      that.init();
      that.slide();
    });
  },
  slide: function () {
    timer.clear();
    // show the item
    this.$content.slideDown('slow');
    // after a time out automatically close it
    timer.start(6000, this.close.bind(this));
  },
  close: function (delay) {
    timer.clear();
    this.$content.slideUp(delay);
  }
};

var timer = {
  id: null,
  clear: function () {
    if (this.id) {
      window.clearTimeout(this.id);
      delete this.id;
    }
  },
  start: function (duration, callback) {
    this.id = setTimeout(callback, duration);
  }
};
