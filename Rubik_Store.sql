CREATE DATABASE rubik_store_1;
USE rubik_store_1;

-- Tài khoản vào trang quản trị phone: 0344665810, pass: admin
-- Tài khoản người dùng: phone: 0987654321 , pass: 1234567
-- Tài khoản người dùng: 0912345678 , pass: 1234567

-- Tạo bảng users
CREATE TABLE Users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
	role ENUM('customer', 'admin') DEFAULT 'customer',
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL UNIQUE ,
    password TEXT,
    status ENUM('hiện', 'ẩn') DEFAULT 'hiện',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng User_addresses
CREATE TABLE User_addresses (
    id_address INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
	status ENUM('hiện', 'ẩn') DEFAULT 'hiện',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


insert into User_addresses  (id_address, id_user, name, address, phone, is_default) 
value (1, 2, "Trần Hồng Lĩnh", "Trịnh Mỹ - Ngô Quyền - Tiên Lữ - Hưng Yên", '0344665810', true);

update user_addresses set status = "hiện"
where id_address = 1;

-- Tạo bảng Categories
CREATE TABLE Categories (
    id_categorie INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    `desc` TEXT,
    status ENUM('hiện', 'ẩn') DEFAULT 'hiện',
	slug TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Products
CREATE TABLE Products (
    id_product INT AUTO_INCREMENT PRIMARY KEY,
    id_categorie INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    image_url VARCHAR(500),
    `desc` TEXT,
    status ENUM('hiện', 'ẩn') DEFAULT 'hiện',
    slug TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Product_images (
    id_image INT PRIMARY KEY AUTO_INCREMENT,
    id_product INT,
    image_url VARCHAR(500) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- sản phẩm sẽ bán theo màu sắc hoặc khônng
-- Tạo bảng sản phẩm biến thể

CREATE TABLE Product_variants (
    id_variant INT AUTO_INCREMENT PRIMARY KEY,
    id_product INT,
    color ENUM('stickerless', 'black', 'không có') NOT NULL,
    quantity INT DEFAULT 0 CHECK (quantity >= 0),
    price INT NOT NULL CHECK (price >= 0),
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- Tạo bảng Carts
CREATE TABLE Carts (
    id_user INT,
	id_variant INT NOT NULL,
    quantity  INT CHECK (quantity  > 0),
    price INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user, id_variant)
);

INSERT INTO Carts (id_user, id_variant, quantity, price) VALUES 
(2, 6, 1, 650000);
(2, 1, 2, 290000);



DELETE FROM Carts 
WHERE id_user = 2 AND id_variant = 6;


-- Tạo bảng Sale_invoices
CREATE TABLE Sale_invoices (
    id_sale_invoice INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_address INT,
    `desc` TEXT,
    total INT,
    pay ENUM('COD', 'QR') DEFAULT 'COD',
    status ENUM('Đang xác nhận', 'Đang lấy hàng', 'Đang giao hàng', 'Hoàn thành', 'Đã hủy đơn') DEFAULT 'Đang xác nhận',
    request ENUM('Đặt hàng', 'Hủy đơn') DEFAULT NULL,  -- Trường yêu cầu
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- Tạo bảng Sale_invoice_details
CREATE TABLE Sale_invoice_details (
    id_sale_invoice INT NOT NULL,
    id_variant INT NOT NULL,
    quantity  INT CHECK (quantity  > 0),
    price INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_sale_invoice, id_variant)
);

create table News (
	id_new INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT NOT NULL,
    `desc` TEXT,
    image_url VARCHAR(500) NOT NULL,
    href VARCHAR(500) NOT NULL, -- đường dẫn đến bài viết
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

--  XÂY DỰNG TRIGGER
DELIMITER $$
CREATE TRIGGER after_insert_sale_invoice_details
AFTER INSERT ON Sale_invoice_details
FOR EACH ROW
BEGIN
    DECLARE current_quantity INT;
    SELECT quantity INTO current_quantity FROM Product_variants WHERE id_variant = NEW.id_variant;
    IF current_quantity < NEW.quantity THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số lượng tồn kho không đủ';
    END IF;
    UPDATE Product_variants
    SET quantity = quantity - NEW.quantity
    WHERE id_variant = NEW.id_variant;

    UPDATE Sale_invoices
    SET total = (
        SELECT SUM(price * quantity)
        FROM Sale_invoice_details
        WHERE id_sale_invoice = NEW.id_sale_invoice
    )
    WHERE id_sale_invoice = NEW.id_sale_invoice;
END$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER after_delete_sale_invoice_details
AFTER DELETE ON Sale_invoice_details
FOR EACH ROW
BEGIN
    -- Cập nhật số lượng tồn kho trong Product_variants
    UPDATE Product_variants
    SET quantity = quantity + OLD.quantity
    WHERE id_variant = OLD.id_variant;

    -- Cập nhật tổng tiền trong Sale_invoices
    UPDATE Sale_invoices
    SET total = IFNULL((
        SELECT SUM(price * quantity)
        FROM Sale_invoice_details
        WHERE id_sale_invoice = OLD.id_sale_invoice
    ), 0)
    WHERE id_sale_invoice = OLD.id_sale_invoice;
END$$
DELIMITER ;;



DELIMITER $$
CREATE PROCEDURE DeleteSaleInvoice(IN invoice_id INT)
BEGIN
    START TRANSACTION;

    DELETE FROM Sale_invoice_details
    WHERE id_sale_invoice = invoice_id;

    DELETE FROM Sale_invoices
    WHERE id_sale_invoice = invoice_id;

    COMMIT;
END$$
DELIMITER ;





-- Trigger cập nhật lại ảnh sản phẩm khi thay đổi trường ảnh chính
DELIMITER $$
CREATE PROCEDURE SetProductImageMain(
    IN p_id_image INT,
    IN p_id_product INT,
    IN p_image_url VARCHAR(500),
    IN p_is_main BOOLEAN
)
BEGIN
    START TRANSACTION;
    -- Nếu is_main được đặt thành true
    IF p_is_main = 1 THEN
        -- Đặt tất cả ảnh của sản phẩm thành is_main = 0
        UPDATE Product_images
        SET is_main = 0
        WHERE id_product = p_id_product;

        -- Đặt ảnh được chọn thành is_main = 1
        UPDATE Product_images
        SET is_main = 1
        WHERE id_image = p_id_image;

        -- Cập nhật image_url trong Products thành ảnh chính
        UPDATE Products
        SET image_url = p_image_url
        WHERE id_product = p_id_product;
    -- Nếu is_main được đặt thành false
    ELSEIF p_is_main = 0 THEN
        -- Kiểm tra xem ảnh này trước đó có phải ảnh chính không
        IF (SELECT is_main FROM Product_images WHERE id_image = p_id_image) = 1 THEN
            -- Đặt ảnh thành is_main = 0
            UPDATE Product_images
            SET is_main = 0
            WHERE id_image = p_id_image;

            -- Đặt image_url trong Products thành NULL
            UPDATE Products
            SET image_url = NULL
            WHERE id_product = p_id_product;
        ELSE
            -- Nếu không phải ảnh chính trước đó, chỉ cập nhật is_main
            UPDATE Product_images
            SET is_main = 0
            WHERE id_image = p_id_image;
        END IF;
    END IF;
    COMMIT;
END$$
DELIMITER ;



DELIMITER $$
CREATE PROCEDURE DeleteProductImage(
    IN p_id_image INT,
    IN p_id_product INT
)
BEGIN
    START TRANSACTION;
    -- Kiểm tra xem ảnh bị xóa có phải ảnh chính không
    IF (SELECT is_main FROM Product_images WHERE id_image = p_id_image) = 1 THEN
        -- Xóa bản ghi
        DELETE FROM Product_images
        WHERE id_image = p_id_image;

        -- Đặt image_url trong Products thành NULL
        UPDATE Products
        SET image_url = NULL
        WHERE id_product = p_id_product;
    ELSE
        -- Nếu không phải ảnh chính, chỉ xóa bản ghi
        DELETE FROM Product_images
        WHERE id_image = p_id_image;
    END IF;
    COMMIT;
END$$
DELIMITER ;

-- trigger thực hiện thay đổi dịa chỉ mặc định
CREATE TABLE User_addresses (
    id_address INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    status ENUM('hiện', 'ẩn') DEFAULT 'hiện',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- trigger thực hiện thay đổi địa chỉ mặc định
DELIMITER //

CREATE PROCEDURE UpdateUserAddress(
    IN p_id_address INT,
    IN p_id_user INT,
    IN p_name VARCHAR(200),
    IN p_address TEXT,
    IN p_phone VARCHAR(10),
    IN p_is_default BOOLEAN,
    IN p_status ENUM('hiện', 'ẩn') -- Thêm tham số p_status để cập nhật trường status
)
BEGIN
    START TRANSACTION;
    
    IF p_is_default = TRUE THEN
        UPDATE User_addresses
        SET is_default = FALSE
        WHERE id_user = p_id_user
        AND id_address != p_id_address;
    END IF;
    
    UPDATE User_addresses
    SET name = p_name,
        address = p_address,
        phone = p_phone,
        is_default = p_is_default,
        status = p_status, -- Cập nhật giá trị của status
        updated_at = CURRENT_TIMESTAMP
    WHERE id_address = p_id_address
    AND id_user = p_id_user;
    
    COMMIT;
END;//

DELIMITER ;

-- trigger thay đổi giá trị của trường requier
DELIMITER $$

CREATE TRIGGER update_sale_invoice_status
BEFORE UPDATE ON Sale_invoices
FOR EACH ROW
BEGIN
    -- Kiểm tra nếu request thay đổi từ 'Đặt hàng' thành NULL
    IF OLD.request = 'Đặt hàng' AND NEW.request IS NULL THEN
        SET NEW.status = 'Đang lấy hàng';
    -- Kiểm tra nếu request thay đổi từ 'Hủy đơn' thành NULL
    ELSEIF OLD.request = 'Hủy đơn' AND NEW.request IS NULL THEN
        SET NEW.status = 'Đã hủy đơn';
    END IF;
END$$

DELIMITER ;

-- Trigger khi sale_invoices bị update có status :"Đã hủy đơn" sẽ cộng lại số lượng cho product_variants
DELIMITER $$

CREATE TRIGGER after_update_sale_invoice_status
AFTER UPDATE ON Sale_invoices
FOR EACH ROW
BEGIN
    -- Kiểm tra nếu trạng thái mới là 'Đã hủy đơn' và trạng thái cũ không phải 'Đã hủy đơn'
    IF NEW.status = 'Đã hủy đơn' AND OLD.status != 'Đã hủy đơn' THEN
        -- Cộng lại số lượng vào Product_variants dựa trên Sale_invoice_details
        UPDATE Product_variants pv
        JOIN Sale_invoice_details sid ON pv.id_variant = sid.id_variant
        SET pv.quantity = pv.quantity + sid.quantity
        WHERE sid.id_sale_invoice = NEW.id_sale_invoice;
    END IF;
END$$

DELIMITER ;

UPDATE Sale_invoices 
SET status = "Đang xác nhận"
WHERE id_sale_invoice = 31;

UPDATE Sale_invoices 
SET request = "Đặt hàng"
WHERE id_sale_invoice = 31;

-- Kiểm tra kết quả
SELECT * FROM Sale_invoices WHERE id_sale_invoice = 30;

select * from sale_invoice_details where id_sale_invoice = 31;

select * from product_variants where id_variant = 5;



SHOW TRIGGERS;

--  Thêm dữ liệu mẫu

-- mật khẩu được mã hóa bằng bcrypt, mật khẩu là "admin"
INSERT INTO Users (id_user, role, name, email, phone, password, status) VALUES 
(1, 'admin', 'Trần Hồng Lĩnh', 'linh3789az@gmail.com', '0344665810', '$2b$10$CBSoRyUkKko8U50/MGsoxeNzyI07p4dwB/N9EWzUqayWYVocaaYhS' ,'hiện');


-- Thêm 3 bản ghi cho Employees, mật khẩu 1234567
INSERT INTO Users (id_user, role, name, email, phone, password, status) VALUES
(2, 'customer', 'Trần Thị B', 'tranthib@example.com', '0987654321', '$2b$10$PFQTjDLNNmWKjw7oIHMhpODcgcX6xCkIQPOPrH9NO1FPG2o2R3lGW', 'hiện'),
(3, 'customer', 'Lê Văn C', 'levanc@example.com', '0912345678', '$2b$10$PFQTjDLNNmWKjw7oIHMhpODcgcX6xCkIQPOPrH9NO1FPG2o2R3lGW', 'hiện');




