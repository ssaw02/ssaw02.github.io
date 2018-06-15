var data = {};
var cartItems = [];

$(function() {

  $.ajaxSetup({async: false});
  // https://dl.dropboxusercontent.com/s/230jd5l2ja1wutr/data.json
  $.getJSON("data.json" , function(jsonData) {
    data = jsonData;
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

  /* Set items in the header cart */
  setCartItem();

  /* productDetail Size Click Event */
  $("#addToCart").on("click", function () {
    console.log("addToCart Click");
    $(".headerCartDiv a span.minicartQuantity").addClass("active");
    var quantity = $(".headerCartDiv a span.minicartQuantity").text();
    var cartItem = $("input#cartItem").val();
    if(cartItem != "" && cartItem != null){
      cartItem = cartItem + "," + $("input#pid").val() + $("#sizeArea a.selected span.value").text();
    }else{
      cartItem = $("input#pid").val() + $("#sizeArea a.selected span.value").text();
    }
    $(".headerCartDiv a span.minicartQuantity").text(Number(quantity)+1);
    window.sessionStorage.setItem(['cart'],[cartItem]);
  });

});

function setCartItem(){
    cartItems = window.sessionStorage.getItem(['cart']);
    if(cartItems == null){
      return false;
    }else{
      cartItems = cartItems.split(",");
    }
    $(".headerCartDiv a").append("<input type='hidden' id='cartItem' value='" + cartItems + "'/>");
    if(cartItems.length > 0){
      $(".headerCartDiv a span.minicartQuantity").addClass("active");
      $(".headerCartDiv a span.minicartQuantity").text(cartItems.length);
    }
}

function allProduct(appendId){
    var appendArea = $("#" + appendId);
    var productList = data.product;
    if(appendArea.length == 0 || productList.length == 0){
      return false;
    }
    var str = "";
    for( var i=0; i < productList.length; i++) {
      str = str +
      "<li id='" + productList[i].ID + "'>" +
      "<a href='productDetails.html?productId=" + productList[i].ID + "'>" +
      "<img src='img/product/" + productList[i].ID + ".jpeg' alt='サンプル'>" +
      "<div class='productName'>" + productList[i].name + "</div>" +
      "<div class='productPrice'>￥" + productList[i].price + "</div>" +
      "</a>" +
      "</li>";
    }
    appendArea.append(str);
}

function getProductDetali(productId, appendId){
    var appendArea = $("#" + appendId);
    var productList = data.product;
    if(appendArea.length == 0 || productList.length == 0){
      return false;
    }
    var str = "";
    var sizeStr = "";
    for( var i=0; i < productList.length; i++) {
      if(productId != productList[i].ID){
        continue;
      }
      for(var j=0; j < productList[i].size.length; j++){
        sizeStr = sizeStr + "<a href='javascript:void(0)'><span class='value'>" + productList[i].size[j] + "</span></a>";
      }

      str = str +
      "<li class='detail1'>" +
      "<img src='img/product/" + productList[i].ID + ".jpeg' alt='サンプル'>" +
      "<div class='productName'>" + productList[i].name + "</div>" +
      "<div class='productPrice'>" + productList[i].price + "</div>" +
      "</li>";

      break;
    }
    appendArea.find("#sizeArea").append(sizeStr);
    appendArea.find(".detail2").before(str);
    appendArea.css("display", "block")

    $("input#pid").val(productId);

    /* productDetail Size Click Event */
    $("#sizeArea a").on("click", function () {
      if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
        $("#addToCart").attr("disabled", "disabled");
        return;
      }else{
        $("#addToCart").removeAttr("disabled");
      }
      $(this).closest("#sizeArea").find("a").removeClass('selected');
  		$(this).addClass("selected");
    });
}

function recommendProduct(productIdList, appendId){
    var appendArea = $("#" + appendId);
    var productList = data.product;
    if(appendArea.length == 0 || productList.length == 0){
      return false;
    }
    var str = "";
    for( var i=0; i < productList.length; i++) {
      if(productIdList.indexOf(productList[i].ID) == -1){
        continue;
      }
      str = str +
      "<li id='" + productList[i].ID + "'>" +
      "<a href='productDetails.html?productId=" + productList[i].ID + "'>" +
      "<img src='img/product/" + productList[i].ID + ".jpeg' alt='サンプル'>" +
      "<div class='productName'>" + productList[i].name + "</div>" +
      "<div class='productPrice'>" + productList[i].price + "</div>" +
      "</a>" +
      "</li>";
    }
    appendArea.append(str);
}

function getCartList(){
    var appendArea = $("#cartList");
    var productList = data.product;
    cartItems = window.sessionStorage.getItem(['cart']);
    if(cartItems == null){
      $(appendArea).before("<h2>カートは空です。</h2>");
      return false;
    }else{
      cartItems = cartItems.split(",");
    }
    var str = "";
    for( var i=0; i < cartItems.length; i++) {
      for( var j=0; j < productList.length; j++) {
        if(cartItems[i].indexOf(productList[j].ID) == -1){
          continue;
        }
        str = str +
        "<tr class='cartRow'>" +
        "<td class='itemImage'>" +
        "<a href='productDetails.html?productId=" + productList[j].ID + "'>" +
        "<img src='img/product/" + productList[j].ID + ".jpeg' alt='サンプル'>" +
        "</a>" +
        "</td>" +
        "<td class='productName'>" + productList[j].name + "</td>" +
        "<td class='productPrice'>"  + productList[j].price + "</td>" +
        "<td class='productDelete'>" +
        "<a href='javascript:void(0)'><span>削除</span></a>" +
        "<input class='hiddenPid' type='hidden' value='" + cartItems[i] + "'>" +
        "</td>" +
        "</tr>";
      }
    }
    appendArea.find("#cartTable tbody").append(str);
    appendArea.css("display", "block")
    console.log($('.hiddenPid'));

    /* cartTable delete Click Event */
    $(".productDelete a").on("click", function () {
      var pos = cartItems.indexOf($(this).closest("td").find(".hiddenPid").val());
      cartItems.splice(pos, 1);
      window.sessionStorage.removeItem(['cart']);
      if(cartItems.length > 0){
        window.sessionStorage.setItem(['cart'],[cartItems]);
      }
      window.location.reload();
    });
}
