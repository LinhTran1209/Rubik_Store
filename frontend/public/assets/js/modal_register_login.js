function check_input_register() {
    if (check_input_name() && check_input_phone() && check_input_pass1() && check_input_pass2 && check_input_veri()) {
        _successful("🎉🎉 Đăng ký thành công 🎉🎉");
    }
}

function check_input_login() {
    if (check_input_account_login() && check_input_pass_login()) {
        _successful("🎉🎉 Đăng nhập thành công 🎉🎉");
    }
}

// hàm hiển thị thông báo đăng ký hoặc đăng nhập thành công thành công
function _successful(noti) {
    document.getElementById('successful_notifi').textContent  = noti;
    document.getElementById('successful_notifi').style.display =  'block';

      // Ẩn thông báo sau 5 giây
    setTimeout(() => {
        document.getElementById('successful_notifi').style.display = 'none';
    }, 3000);
}

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


// Hàm kiểm tra phần đăng ký
function check_input_name() {
    var name = document.getElementById("input-name-register");
    var err = document.getElementById("error_message-name-register")
    if (name.value.length == 0) {
        err.innerHTML = "Tên đăng ký không được để trống";
        background_boder_error(name);
        return false;
    }
    else if (name.value.length > 20) {
        err.innerHTML = "Tên đăng ký không được vượt quá 20 ký tự";
        background_boder_error(name);
        return false;
    }
    else {
        background_boder_right(name, err);
        return true;
    }
}


function check_input_phone() {
    var phone = document.getElementById("input-phone-register");
    var err = document.getElementById("error_message-phone-register")
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

function check_input_pass1() {
    var pass1 = document.getElementById("input-pass1-register");
    var err = document.getElementById("error_message-pass1-register")
    if (pass1.value.length == 0) {
        err.innerHTML = "Mật khẩu không được để trống";
        background_boder_error(pass1)
        return false;
    }
    else if (pass1.value.length <6) {
        err.innerHTML = "Mật khẩu phải lớn hơn 6 ký tự";
        background_boder_error(pass1);
        return false;
    }
    else if (!/\d/.test(pass1.value)) {
        err.innerHTML = "Mật khẩu phải có ký tự số";
        background_boder_error(pass1);
        return false;
    }
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass1.value)) {
        err.innerHTML = "Mật khẩu phải có ký tự đặc biệt";
        background_boder_error(pass1);
        return false;
    }
    else {
        background_boder_right(pass1, err);
        return true;
    }
}


function check_input_pass2() {
    var pass1 = document.getElementById("input-pass1-register");
    var pass2 = document.getElementById("input-pass2-register");
    var err = document.getElementById("error_message-pass2-register")
    if (pass2.value.length == 0) {
        err.innerHTML = "Mật khẩu nhập lại không được để trống";
        background_boder_error(pass2)
        return false;
    }
    else if (pass1.value !== pass2.value) {
        err.innerHTML = "Mật khẩu nhập lại không hợp lệ";
        background_boder_error(pass2);
        return false;
    }
    else {
        background_boder_right(pass2, err);
        return true;
    }
}

function check_input_veri() {
    var veri = document.getElementById("input-veri-register");
    var err = document.getElementById("error_message-veri-register")
    if (veri.value.length == 0) {
        err.innerHTML = "Mã xác nhận không được để trống";
        background_boder_error(veri)
        return false;
    }
    else if (veri.value !== "9W5G") {
        err.innerHTML = "Mã xác nhận không chính xác";
        background_boder_error(veri);
        return false;
    }
    else {
        background_boder_right(veri, err);
        return true;
    }
}

// Hàm kiểm tra phần đăng nhập
function check_input_account_login() {
    var account = document.getElementById("input-account-login");
    var err = document.getElementById("error_message-account-login")
    if (account.value.length == 0) {
        err.innerHTML = "Tên đăng nhập không được để trống";
        background_boder_error(account);
        return false;
    }
    else {
        background_boder_right(account, err);
        return true;
    }
}

function check_input_pass_login() {
    var pass = document.getElementById("input-pass-login");
    var err = document.getElementById("error_message-pass-login")
    if (pass.value.length == 0) {
        err.innerHTML = "Mật khẩu không được để trống";
        background_boder_error(pass);
        return false;
    }
    else {
        background_boder_right(pass, err);
        return true;
    }
}