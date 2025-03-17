$(document).ready(function() {
    updateCartUI()
    updateCountCart()
    updateCartSmall()
});



function updateCartUI() {
    var rows = `
    <span style="font-weight: bold;">THÔNG TIN GIỎ HÀNG</span>
    <div class="table__header-cart">
        <div class="table__header-cart-sp">Sản phẩm</div>
        <div class="table__header-cart-dg">Đơn giá</div>
        <div class="table__header-cart-sl">Số lượng</div>
        <div class="table__header-cart-tt">Thành tiền</div>
    </div>
    `;
    data = localStorage.getItem("orders");
    order = JSON.parse(data) || [];
    
    if (order.length == 0) {
        rows += '<div id="empty-cart">Giỏ hàng trống</div>';
        $(".info__detail-cart").html(rows);
        return;
    }

    for (let i = 0; i < order.length; i++) {
        let item = order[i];
        var tt = (Number(item.count) * Number(item.price.slice(0, -1))).toLocaleString('vi-VN')+".000₫"
        rows  += `
            <div class="line__detail-cart"></div>
            <div class="oder__item">
                <div class="oder__item-img-all">
                    <img class="oder__item-img" src="${item.photo}" alt="">
                </div>
                <div class="oder__item-name-color">
                    <div class="oder__item-name">
                        <span>${item.name}</span>
                    </div>
                    <div class="oder__item-color">
                        <span>Màu sắc: ${item.color}</span>
                    </div>
                </div>
                <div class="oder__item-price">
                    <span>${item.price}</span>
                </div>
                <div class="oder__item-btn-count">
                    <button onclick="sub_product(this)" class="btn__item-count" id="sub-item-count">-</button>
                    <input class="class__value-count" data-product-id="${i+1}" type="text" name="" id="value-count" value="${item.count}">
                    <button onclick="add_product(this)" class="btn__item-count" id="add-item-count">+</button>
                </div>
                <div class="into__money">
                    <span>${tt}</span>
                </div>
                <div class="__dele-oder-item">
                    <button onclick = "click_dele_row_cart()" class="btn__dele-oder-item">Xóa</button>
                </div>
            </div>
        `
            // data-product-id="${i+1}" tạo ra attribute như việc thiết lập khóa chính vậy
        $(".info__detail-cart").html(rows);
    }

    rows += `
        <div class="table__money" id="id_table__money">
            <table>
                <tbody>
                    <tr>
                        <th>Tổng tiền hàng:</th>
                        <td id="tien_hang">1.000.000₫</td>
                    </tr>
                    <tr>
                        <th>Phí vận chuyển:</th>
                        <td id="van_chuyen">Miễn phí</td>
                    </tr>
                    <tr>
                        <th>Thành tiền:</th>
                        <td id="tong_tien" style="color: rgb(255, 66, 79); font-weight: bold;">1.000.000₫</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
    $(".info__detail-cart").html(rows);
}