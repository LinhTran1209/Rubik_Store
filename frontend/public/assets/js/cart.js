// js phần thông tin người dùng

// hàm tạo background và boder lỗi khi sai input
function background_boder_error(id) {
    id.style.border = "0.0001px solid rgb(255, 66, 79)";
    id.style.backgroundColor  = "rgb(255, 246, 247)";
}
// hàm quay lại background và boder và thông báo lỗi cùng mất bình thường khi nhập đúng
function background_boder_right(id, err) {
    id.style.border = "0.0001px solid #dbdbdb";
    id.style.backgroundColor  = "white";
    err.innerHTML = "";
}




function check_input_name() {
    var name = document.getElementById("input__user-cart-name");
    var err = document.getElementById("err-mss-name")
    if (name.value.length == 0) {
        err.innerHTML = "Họ tên không được để trống";
        background_boder_error(name);
        return false;
    }
    else if (name.value.length > 20) {
        err.innerHTML = "Họ tên không được vượt quá 20 ký tự";
        background_boder_error(name);
        return false;
    }
    else {
        background_boder_right(name, err);
        return true;
    }
}



function check_input_phone() {
    var phone = document.getElementById("input__user-cart-phone");
    var err = document.getElementById("err-mss-phone")
    var check = /\d/;
    if (phone.value.length == 0) {
        err.innerHTML = "Số điện thoại không được để trống";
        background_boder_error(phone)
        return false;
    }
    else if (check.test(phone.value) == false) {
        err.innerHTML = "Số điện thoại phải là số";
        background_boder_error(phone);
        return false;
    }
    else if (!(phone.value.length >= 10 && phone.value.length <= 11)) {
        err.innerHTML = "Số điện thoại phải có độ dài 10 hoặc 11 số";
        background_boder_error(phone);
        return false;
    }
    else {
        background_boder_right(phone, err);
        return true;
    }
}


function check_input_address() {
    var name = document.getElementById("input__user-cart-address");
    var err = document.getElementById("err-mss-address")
    if (name.value.length == 0) {
        err.innerHTML = "Địa chỉ không được để trống";
        background_boder_error(name);
        return false;
    }
    else if (name.value.length > 20) {
        err.innerHTML = "Địa chỉ không được vượt quá 200 kí tự";
        background_boder_error(name);
        return false;
    }
    else {
        background_boder_right(name, err);
        return true;
    }
}


function check_input_cart() {
    data = localStorage.getItem("orders");
    order_get = JSON.parse(data) || [];
    if (check_input_name() && check_input_phone() && check_input_address() && order_get.length > 0){
        alert("Đặt hàng thành công");
    }
    if(order_get.length === 0) {
        alert("Hãy thêm sản phẩm vào giỏ hàng!")
    }
}


// Xóa bản ghi trong giỏ hàng
function click_dele_row_cart() {
    // $(document).off('click', '.btn__dele-oder-item');
    $(document).on('click', '.btn__dele-oder-item', function() {
        var name = $(this).closest('.oder__item').find('.oder__item-name span').text();
        var color = $(this).closest('.oder__item').find('.oder__item-color span').text().split(':')[1].trim();

        // Lấy dữ liệu từ localStorage
        var data = localStorage.getItem("orders");
        var order_get = JSON.parse(data) || [];

        // Tạo một mảng mới không chứa bản ghi cần xóa
        var updatedOrders = order_get.filter(function(item) {
            return !(item.name == name && item.color == color);
        });

        // Lưu mảng orders mới vào localStorage
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        
        updateCartSmall();
        updateCartUI();
        updateCountCart();
        updateTotalMoney();
    });
}




// Hàm cập nhật dữ liệu vào localStorage
function updateLocalStorage() {
    // Lấy tất cả các phần tử có class "oder__item"
    var orderItems = document.querySelectorAll(".oder__item");
  
    // Tạo một mảng để lưu trữ dữ liệu của các phần tử
    var orders = [];
  
    // Duyệt qua từng phần tử và lấy thông tin
    orderItems.forEach(function(item) {
        // alert(item.querySelector(".oder__item-name span").textContent);
        var orderItem = {
            "name": item.querySelector(".oder__item-name span").textContent,
            "price": item.querySelector(".oder__item-price span").textContent,
            "color": item.querySelector(".oder__item-color span").textContent.split(':')[1].trim(),
            "count": item.querySelector("#value-count").value,    
            "photo": item.querySelector(".oder__item-img").src,
      };                       
      orders.push(orderItem);
    });
  
    // Lưu mảng orders vào localStorage
    localStorage.setItem("orders", JSON.stringify(orders));
}

// hàm chuyển đổi giá
function getIntegerFromCurrency(currencyString) {
    return Number(currencyString.replace(/[^0-9]/g, ""));
  }

// Hàm cập nhật lại tổng tiền hàng
function updateTotalMoney(){
    var orderItems1 = document.querySelectorAll(".oder__item");
    var total_money = 0;
    orderItems1.forEach(function(item1) {
        var itemPriceString = item1.querySelector(".into__money span").textContent;
        var itemPrice = getIntegerFromCurrency(itemPriceString);
        total_money += itemPrice;
    });

    document.getElementById("tien_hang").textContent = total_money.toLocaleString('vi-VN') + "₫";
    if (total_money < 200000){
        document.getElementById("van_chuyen").textContent = "36.000₫";
        document.getElementById("tong_tien").textContent = (total_money + 36000).toLocaleString('vi-VN') + "₫";
    }
    else {
        document.getElementById("van_chuyen").textContent = "Miễn phí";
        document.getElementById("tong_tien").textContent = total_money.toLocaleString('vi-VN') + "₫";
    }
}



$(document).ready(function() {
    // Bắt sự kiện "click" trên container chứa các nút tăng/giảm số lượng
    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("btn__item-count")) {
            updateLocalStorage(event);
            updateCartUI();
            updateTotalMoney()
            updateCartSmall()
        }
    });
    

    window.addEventListener("load", function() {
        updateTotalMoney();
    });

});






