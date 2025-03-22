var n = 2; // Tổng số hình ảnh
var current = 1; // Hình ảnh hiện tại

function auto_ShowImg() {
    // Tăng chỉ số hình ảnh hiện tại
    current = (current % n) + 1; // Nếu current < n, tăng lên; nếu bằng n, quay lại 1

    $("#id-img-adv").animate({ opacity: 0 }, 700, function () {
        // Cập nhật thuộc tính src
        $(this).attr("src", "/assets/img/adv" + current + ".jpg");
    }).animate({ opacity: 1 }, 1000);
}

// Đặt interval để tự động chuyển hình ảnh
setInterval(auto_ShowImg, 5000);

// function next_Img() {
//     // Chuyển đến hình ảnh tiếp theo
//     current = (current % n) + 1; // Cập nhật chỉ số hình ảnh
//     $("#id-img-adv").animate({ opacity: 0 }, 500, function () {
//         $(this).attr("src", "/assets/img/adv" + current + ".jpg");
//     }).animate({ opacity: 1 }, 500);
// }

// function back_Img() {
//     // Chuyển đến hình ảnh trước đó
//     current = (current - 2 + n) % n + 1; // Giảm và đảm bảo chỉ số không âm

//     $("#id-img-adv").animate({ opacity: 0 }, 500, function () {
//         $(this).attr("src", "/assets/img/adv" + current + ".jpg");
//     }).animate({ opacity: 1 }, 500);
// }