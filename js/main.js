Vue.component('product-list', {
  props: ['product'],
  template: '<li :id="product.ID"><a :href="product.url"><img :src="product.imageUrl"><div class="productName">{{product.name}}</div><div class="productPrice">{{product.price}}</div></a></li>'
});

Vue.component('product-detail', {
  props: ['product'],
  template: '<li class="detail1"><img :src="product.imageUrl"><div class="productName">{{product.name}}</div><div class="productPrice">{{product.price}}</div></li>'
});

var sizeContent = Vue.extend({
  props: ['variation'],
  template: '<div id="sizeArea"><h2>Size</h2><a v-for="(val, key) in variation" href="javascript:void(0)"><span class="value">{{val.size}}</span></a></div>'
});
var addCartContent = Vue.extend({
  props: ['pid'],
  template: '<div id="addCartArea"><input type="hidden" id="pid" :value="pid" /><button id="addToCart" type="submit" title="ADD TO CART" value="ADD TO CART" class="button" disabled><span>ADD TO CART</span></button></div>'
});
var productContent = Vue.extend({
  props: ['product'],
  template: '<li class="detail2"><size-content v-bind:variation=product.variation></size-content><add-cart-content :pid=product.ID></add-cart-content></li>',
  components: {
    'size-content': sizeContent,
    'add-cart-content': addCartContent
  }
});
Vue.component('product-detail-content', productContent);

var cartTr = Vue.extend({
  props: ['item'],
  template: '<tr class="cartRow"><td class="itemImage"><a :href="item.url"><img :src="item.imageUrl"></a></td><td class="productName"><span>{{item.name}}</span></td><td class="productPrice"><span>\{{item.price}}</span></td><td class="productDelete"><a href="javascript:void(0)"><span>削除</span></a><input class="hiddenPid" type="hidden" :value="item.ID"></td></tr>'
});
var cartTable = Vue.extend({
  props: {
    'list': Array,
    'product': Object
  },
  template: '<table id="cartTable"><thead><tr><th colspan="2">商品</th><th>価格</th><th><!-- deleteBtn --></th></tr></thead><tbody><cart-tr v-for="pid in list" :key="pid" v-bind:item="product[pid]"></cart-tr></tbody></table>',
  components: {
    'cart-tr': cartTr
  }
});
Vue.component('cart-table', cartTable);

$(function() {

  /* productDetail Size Click Event */
  $(document).on("click", "#sizeArea a", function () {
    if ($(this).hasClass("selected")) {
      $(this).removeClass("selected");
      $("#addToCart").attr("disabled", "disabled");
      return;
    }

    $("#addToCart").removeAttr("disabled");
    $(this).closest("#sizeArea").find("a").removeClass('selected');
    $(this).addClass("selected");
  });

  /* productDetail addToCart Click Event */
  $(document).on("click", "#addToCart", function () {
    console.log("addToCart Click");
    cartItems.unshift($("input#pid").val());
    head.cartItems.unshift(data.json.product[$("input#pid").val()]);
    window.sessionStorage.setItem(['cart'],[cartItems]);
    minicart.show();
  });

});
