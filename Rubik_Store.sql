CREATE DATABASE rubik_store_1;
USE rubik_store_1;

-- Tài khoản vào trang quản trị phone: 0344665810, pass: admin
-- Tài khoản người dùng: phone: 0987654321 , pass: 1234567

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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

insert into User_addresses value (1, 2, "Trần Hồng Lĩnh", "Trịnh Mỹ - Ngô Quyền - Tiên Lữ - Hưng Yên")

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

-- Tạo bảng Sale_invoices
CREATE TABLE Sale_invoices (
    id_sale_invoice INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    `desc` TEXT,
    total INT,
    pay ENUM('COD', 'QR') DEFAULT 'COD',
    status ENUM('Đang xác nhận', 'Đang lấy hàng', 'Đang giao hàng', 'Hoàn thành') DEFAULT 'Đang xác nhận',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
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




SHOW TRIGGERS;

--  Thêm dữ liệu mẫu

-- mật khẩu được mã hóa bằng bcrypt, mật khẩu là "admin"
INSERT INTO Users (id_user, role, name, email, phone, password, status) VALUES 
(1, 'admin', 'Trần Hồng Lĩnh', 'linh3789az@gmail.com', '0344665810', '$2b$10$CBSoRyUkKko8U50/MGsoxeNzyI07p4dwB/N9EWzUqayWYVocaaYhS' ,'hiện');


-- Thêm 3 bản ghi cho Employees, mật khẩu 1234567
INSERT INTO Users (id_user, role, name, email, phone, password, status) VALUES
(2, 'customer', 'Trần Thị B', 'tranthib@example.com', '0987654321', '$2b$10$PFQTjDLNNmWKjw7oIHMhpODcgcX6xCkIQPOPrH9NO1FPG2o2R3lGW', 'hiện'),
(3, 'customer', 'Lê Văn C', 'levanc@example.com', '0912345678', '$2b$10$PFQTjDLNNmWKjw7oIHMhpODcgcX6xCkIQPOPrH9NO1FPG2o2R3lGW', 'hiện');


-- Thêm 3 bản ghi cho Categories
INSERT INTO Categories (id_categorie, name, `desc`, status) VALUES
(1, 'Rubik cơ bản 2x2x2', 'Rubik lập phương bao gồm 2x2x2', 'hiện'),
(2, 'Rubik cơ bản 3x3x3', 'Rubik lập phương bao gồm 3x3x3', 'hiện'),
(3, 'Rubik cơ bản 4x4x4', 'Rubik lập phương bao gồm 4x4x4', 'hiện'),
(4, 'Rubik cơ bản 5x5x5', 'Rubik lập phương bao gồm 5x5x5', 'hiện'),
(5, 'Rubik biến thể 4 mặt', 'Rubik biến thể gồm các loại 4 mặt', 'hiện'),
(6, 'Rubik biến thể 4 mặt', 'Rubik biến thể gồm các loại 4 mặt', 'hiện'),
(7, 'Combo rubik', '"Bao gồm nhiều rubik các loại', 'hiện');

-- Thêm 3 bản ghi cho Products
INSERT INTO Products (id_product, id_categorie, name, image_url, quantity, price, `desc`, status) VALUES
(1, 1, 'Rubik Mofangjiaoshi Meilong 3x3 M Stickerless có nam châm (SP006076)', 'https://res.cloudinary.com/dzweargsr/image/upload/v1742116765/product1_v8ld4w.jpg', 10, 120000, 'Khối Rubik 3x3 MoYu MeiLong 3M Có Nam Châm (Hãng Mod M)

- Tên sản phẩm: MoYu MFJS Meilong 3M 3x3

- Hãng sản xuất: Cubing Classroom - MoYu
- Kích thước cube: 55mm
- Khối lượng cube: 72g
- Màu Sắc: Stickerless và đen
- Dòng Meilong vừa cho ra mắt những khối được gắn sẵn nam châm với mức giá cực kì rẻ.
- Lực hút nam châm nhẹ đến vừa
- Vừa mở hộp có thể hơi khô, cần lube lại để có trải nghiệm tốt hơn.
- Xoay êm, không rít, không kẹt
- Cực kì tốt trong tầm giá.
- Phụ kiện: tua vít, giấy công thức, moyu cards
#meilong3m #rubik3x3 #rubiknamcham #rubik3x3namcham', 'hiện'),
(2, 1, 'Rubik 3x3 GAN 356 M Stickerless with  GES+ (Cao cấp có nam châm)', 'https://res.cloudinary.com/dzweargsr/image/upload/v1742116766/product4_vjiwxf.jpg', 10, 590000, 'Rubik 4x4 mượt mà', 'hiện'),
(3, 1, 'Rubik Gan 356 RS stickerless 3x3x3 (SP004254)', 'https://res.cloudinary.com/dzweargsr/image/upload/v1742116766/product2_j9clmu.jpg', 10, 350000, 'Rubik tam giác dễ chơi', 'hiện'),
(4, 1, 'Rubik GAN 356 M no GES+ 3x3 Stickerless có nam châm cao cấp (SP006057)', 'https://res.cloudinary.com/dzweargsr/image/upload/v1742116766/product3_ugdcig.jpg', 10, 499000, 'Rubik tam giác dễ chơi', 'hiện'),
(5, 1, 'Rubik 3x3 GAN 356 M Stickerless with  GES+ (Cao cấp có nam châm)', 'https://res.cloudinary.com/dzweargsr/image/upload/v1742116766/product4_vjiwxf.jpg', 10, 590000, 'Rubik 4x4 mượt mà', 'hiện'),
(6, 1, 'Rubik Gan 356 RS stickerless 3x3x3', 'https://res.cloudinary.com/dzweargsr/image/upload/v1742116766/product2_j9clmu.jpg', 10, 350000, 'Rubik tam giác dễ chơi', 'hiện');


-- Thêm 3 bản ghi cho news
INSERT INTO News (id_new, title, `desc`, image_url, href) VALUES
(1, 'Hướng dẫn xoay rubik 3x3x3 theo cách đơn giản nhất', 'Hướng dẫn cách giải Rubik 3x3 và công thức rubik 3x3, đây là bài hướng cách xoay rubik 3x3 cực kỳ đơn giản, dựa theo hướng dẫn của Leyan', 'https://res.cloudinary.com/dzweargsr/image/upload/v1742646877/video1_v96tob.jpg', 'https://www.facebook.com/'),
(2, 'Hướng dẫn giải Rubik 2x2x2 chỉ trong 2 phút', 'Cách xoay rubik 2x2x2, cách chơi rubik 2x2, hướng dẫn xoay rubik 2x2, hướng dẫn giải rubik 2x2', 'https://res.cloudinary.com/dzweargsr/image/upload/v1742646878/video3_nxlhp0.jpg', 'https://www.facebook.com/'),
(3, 'Hướng dẫn giải rubik Pyraminx đơn giản nhất', 'Hướng dẫn giải rubik Pyraminx đơn giản nhất', 'https://res.cloudinary.com/dzweargsr/image/upload/v1742646878/video5_ktjtnh.jpg', 'https://www.facebook.com/');

-- Thêm 3 bản ghi cho Sale_invoices
INSERT INTO Sale_invoices (id_sale_invoice, id_user, `desc`, pay) VALUES
(1, 1, 'Mua Rubik 3x3', 'COD'),
(2, 2, 'Mua Rubik 4x4', 'QR'),
(3, 3, 'Mua Pyraminx', 'COD');

-- Thêm 3 bản ghi cho Sale_invoice_details
INSERT INTO Sale_invoice_details (id_sale_invoice, id_product, quantity, price) VALUES
(1, 1, 2, 120000);

INSERT INTO Sale_invoice_details (id_sale_invoice, id_product, quantity, price) VALUES
(1, 2, 1, 350000),
(1, 3, 3, 150000);


-- Test xóa thử chi tiết hóa đơn
-- DELETE FROM Sale_invoice_details WHERE id_sale_invoice = 1 AND id_product = 1;

-- Test xóa hóa đơn

-- CALL DeleteSaleInvoice(1);