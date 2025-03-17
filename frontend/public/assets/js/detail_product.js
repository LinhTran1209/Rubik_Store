function sub_product(elem) {
    var input = elem.parentNode.querySelector('[data-product-id]');
    var value = parseInt(input.value);
    if (value > 1) {
        input.value = value - 1;
    }
}

function add_product(elem) {
    var input = elem.parentNode.querySelector('[data-product-id]');
    var value = parseInt(input.value);
    input.value = value + 1;
}

// Chuyển màu sắc khi chọn màu sắc sản phẩm

function btn_color(id) {
    var item_class = document.getElementsByClassName('btn-product-color');
    for (var i = 0; i < item_class.length; i++) {
        item_class[i].style.backgroundColor = 'white';
        item_class[i].style.color = 'rgb(255, 102, 0)';
    }

    
    document.getElementById(id).style.backgroundColor = 'rgb(255, 102, 0)';
    document.getElementById(id).style.color = 'white';
}


function click_img_small(path_src) {
    document.getElementById('id-img-product-big').src = path_src
}

function check_add_product() {
    var check_color = false;
    var count_product = document.getElementById('quantity-product').value;
    var item_class = document.getElementsByClassName('btn-product-color');
    for (var i = 0; i < item_class.length; i++) {
        if (item_class[i].style.color == 'white') {
            check_color = true;
            break;
        }
    }

    if (check_color == false) {
        alert('Vui lòng chọn màu sắc')
        return false;
    }

    if (count_product == 0) {
        alert('Số lượng phải lớn hơn 0');
        return false;
    }

    alert('Thêm thành công');
    return true;
}




//  jsquery phần chi tiết sản phẩm

var count = 0;

$(document).ready(function() {
    
    // Bắt sự kiện thêm sản phẩm vào giỏ hàng
    $("#btn-add-product-tocart").click(function() {
        if (check_add_product() == true) {
            var name = $(".info__product-title span").text();
            var price = $(".info__product-price strong").text();
            var color;
            if (document.getElementById("btn-product-color-stickerless").style.color == 'white') {
                color = "Stickerless";
            }
            else {
                color = "Đen";
            }
            var photo = $("#id-img-product-big").attr("src");
            var count_p = document.getElementById("quantity-product").value;
            var item = {
                "name": name,
                "price": price,
                "color": color,
                "count":count_p,
                "photo": photo
            };

            data = localStorage.getItem("orders");
            order_get = JSON.parse(data) || [];
            
            var check_id =false;
            for (let i = 0; i < order_get.length; i++) {
                let item = order_get[i];
                count = order_get.length;
                if ((item.name == name) && (item.color == color)) {
                    order_get[i].count = Number(order_get[i].count) + Number(count_p);
                    check_id = true;
                    break;
                }
            }

            if (check_id == false) {
                order_get.push(item); // Thêm sản phẩm vào mảng orders
                count++;
            }
            
            $("#count-in-cart").text(count);
            localStorage.setItem("orders", JSON.stringify(order_get)); // Lưu mảng orders vào localStorage
            updateCartSmall()
        }
    });
});