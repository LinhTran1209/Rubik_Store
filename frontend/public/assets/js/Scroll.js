// Scroll back-top
$(document).ready(function() {
  var isScrolling = false;

  $(window).scroll(function() {
    if (!isScrolling) {
      if ($(this).scrollTop()) {
        $('#back-top').fadeIn();
      } else {
        $('#back-top').fadeOut();
      }
    }
  });

  $('#back-top').click(function() {
    isScrolling = true;
    $('html, body').animate({ scrollTop: 0 }, 500, function() {
      isScrolling = false;
    });
  });
});





$(document).ready(function() {
    $('#to-contact').click(function(event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>

        var targetOffset = $('#all-contact').offset().top; // Lấy vị trí của phần "all-contact"

        $('html, body').animate({ scrollTop: targetOffset }, 500); // Cuộn trang đến vị trí của "all-contact"
    });
});

// Tự động nhìn thấy số lượng sản phẩm trong giỏ hàng
// Giỏ hàng hover tự động cập nhật vào khi hover
$(document).ready(function() {  
  updateCountCart();
  updateCartSmall();
});

function updateCountCart() {
  data = localStorage.getItem("orders");
  order_get = JSON.parse(data) || [];
  $("#count-in-cart").text(order_get.length);
}

// localStorage.clear();


// Giỏ hàng hover tự động cập nhật vào khi hover
function updateCartSmall() {
  data = localStorage.getItem("orders");
  order = JSON.parse(data) || [];
  // alert(order.length)
  var rows = ``;
  if (order.length === 0) {
      rows += `<div class="empty__detail-cart">Giỏ hàng trống</div>`;
      $(".detail-cart").html(rows)  ;
      return;
  }

  rows += `<div class="product__news">Sản phẩm mới thêm</div>`;

  // alert(order.length)
  for (let i = 0; i < order.length; i++) {
    let item = order[i];
    rows  += `
      <a href="">
        <div class="group__detail-cart">
            <div class="group__detail-cart-img">
                <img src="${item.photo}" alt="">
            </div>
            <div class="group__detail-cart-name-color">
                <div class="group__detail-cart-name">
                    <span>${item.name}</span>
                </div>
                <div class="group__detail-cart-color">
                    <span>Màu sắc: ${item.color}</span>
                </div>
            </div>
            <div class="group__detail-cart-price">
                <span>${item.price}</span>
            </div>
        </div>
      </a>
    ` 
  }

  rows += `
    <div class="class__cart-check">
      <a id="a__cart-check" href="cart.html">Xem giỏ hàng</a>
    </div>
  `;

  $(".detail-cart").html(rows);

}






