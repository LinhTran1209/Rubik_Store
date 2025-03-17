-- Tạo cơ sở dữ liệu cho website bán Rubik
CREATE DATABASE rubik_store;
USE rubik_store;

-- Tạo bảng Roles
CREATE TABLE Roles (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    `desc` TEXT
);

-- Tạo bảng Employees
CREATE TABLE Employees (
    id_employee INT AUTO_INCREMENT PRIMARY KEY,
    id_role INT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL UNIQUE ,
    address TEXT,
    status ENUM('hiện', 'ẩn') DEFAULT 'hiện',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- INSERT INTO Employees (id_role, name, email, phone, address, status)
-- VALUES (1, 'Nguyễn Văn A', 'nguyenvana@example.com', '0123456789', '123 Đường Láng, Hà Nội', 'hiện');

-- Tạo bảng Customers
CREATE TABLE Customers (
    id_customer INT AUTO_INCREMENT PRIMARY KEY,
    id_role INT DEFAULT 3,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL UNIQUE ,
    address TEXT,
    status ENUM('hiện', 'ẩn') DEFAULT 'hiện',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Suppliers
CREATE TABLE Suppliers (
    id_supplier INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL UNIQUE ,
    address TEXT,
    status ENUM('hiện', 'ẩn') DEFAULT 'hiện',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Categories
CREATE TABLE Categories (
    id_categorie INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    `desc` TEXT,
    status ENUM('hiện', 'ẩn') DEFAULT 'hiện',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Products
CREATE TABLE Products (
    id_product INT AUTO_INCREMENT PRIMARY KEY,
    id_categorie INT,
    name VARCHAR(200) NOT NULL,
    image_url VARCHAR(500),
    quantity  INT DEFAULT 0,
    price INT NOT NULL,
    `desc` TEXT,
    status ENUM('hiện', 'ẩn') DEFAULT 'hiện',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Buy_invoices
CREATE TABLE Buy_invoices (
    id_buy_invoice INT AUTO_INCREMENT PRIMARY KEY,
    id_supplier INT,
    id_employee INT,
    `desc` TEXT,
    total INT,
    status ENUM('Đang xác nhận', 'Đang lấy hàng', 'Đang giao hàng', 'Hoàn thành') DEFAULT 'Đang xác nhận',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Buy_invoice_details
CREATE TABLE Buy_invoice_details (
    id_buy_invoice INT,
    id_product INT,
    quantity  INT CHECK (quantity  > 0),
    price INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_buy_invoice, id_product)
);

-- Tạo bảng Carts
CREATE TABLE Carts (
    id_customer INT,
    id_product INT,
    quantity  INT CHECK (quantity  > 0),
    price INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_customer, id_product)
);

-- Tạo bảng Sale_invoices
CREATE TABLE Sale_invoices (
    id_sale_invoice INT AUTO_INCREMENT PRIMARY KEY,
    id_customer INT,
    `desc` TEXT,
    total INT,
    pay ENUM('COD', 'QR') DEFAULT 'COD',
    status ENUM('Đang xác nhận', 'Đang lấy hàng', 'Đang giao hàng', 'Hoàn thành') DEFAULT 'Đang xác nhận',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Sale_invoice_details
CREATE TABLE Sale_invoice_details (
    id_sale_invoice INT,
    id_product INT,
    quantity  INT CHECK (quantity  > 0),
    price INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_sale_invoice, id_product)
);



-- Thêm 3 bản ghi cho Roles
INSERT INTO Roles (name, `desc`) VALUES
('Admin', 'Quản trị viên hệ thống'),
('Seller', 'Nhân viên bán hàng'),
('Buyer', 'Khách hàng mua sắm');


-- Thêm 3 bản ghi cho Employees
INSERT INTO Employees (id_role, name, email, phone, address, status) VALUES
(1, 'Nguyễn Văn A', 'nguyenvana@example.com', '0123456789', '123 Đường Láng, Hà Nội', 'hiện'),
(2, 'Trần Thị B', 'tranthib@example.com', '0987654321', '45 Lê Lợi, TP.HCM', 'hiện'),
(1, 'Lê Văn C', 'levanc@example.com', '0912345678', '78 Hùng Vương, Đà Nẵng', 'hiện');


-- Thêm 3 bản ghi cho Customers
INSERT INTO Customers (id_role, name, email, phone, address, status) VALUES
(3, 'Phạm Thị D', 'phamthid@example.com', '0934567890', '12 Nguyễn Huệ, Huế', 'hiện'),
(3, 'Hoàng Văn E', 'hoangvane@example.com', '0891234567', '56 Trần Phú, Nha Trang', 'hiện'),
(3, 'Đỗ Thị F', 'dothif@example.com', '0978123456', '89 Kim Mã, Hà Nội', 'hiện');


-- Thêm 3 bản ghi cho Suppliers
INSERT INTO Suppliers (name, email, phone, address, status) VALUES
('Công ty Rubik VN', 'rubikvn@example.com', '0945678901', '101 Điện Biên Phủ, TP.HCM', 'hiện'),
('Nhà cung cấp XYZ', 'xyzsupplier@example.com', '0856789012', '34 Pasteur, Đà Lạt', 'hiện'),
('Rubik Shop', 'rubikshop@example.com', '0967890123', '67 Bà Triệu, Hà Nội', 'hiện');


-- Thêm 3 bản ghi cho Categories
INSERT INTO Categories (name, `desc`, status) VALUES
('Rubik 3x3', 'Rubik lập phương 3x3 cơ bản', 'hiện'),
('Rubik 4x4', 'Rubik lập phương 4x4 nâng cao', 'hiện'),
('Rubik Pyraminx', 'Rubik hình tam giác', 'hiện');

-- Thêm 3 bản ghi cho Products
INSERT INTO Products (id_categorie, name, image_url, quantity, price, `desc`, status) VALUES
(1, 'Rubik Mofangjiaoshi Meilong 3x3 M Stickerless có nam châm (SP006076)', 'https://res.cloudinary.com/dzweargsr/image/upload/v1742116765/product1_v8ld4w.jpg', 50, 120000, 'Khối Rubik 3x3 MoYu MeiLong 3M Có Nam Châm (Hãng Mod M)

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
(2, 'Rubik 3x3 GAN 356 M Stickerless with  GES+ (Cao cấp có nam châm)', 'https://res.cloudinary.com/dzweargsr/image/upload/v1742116766/product4_vjiwxf.jpg', 30, 590000, 'Rubik 4x4 mượt mà', 'hiện'),
(3, 'Rubik Gan 356 RS stickerless 3x3x3 (SP004254)', 'https://res.cloudinary.com/dzweargsr/image/upload/v1742116766/product2_j9clmu.jpg', 20, 350000, 'Rubik tam giác dễ chơi', 'hiện');


INSERT INTO Products (id_categorie, name, image_url, quantity, price, `desc`, status) VALUES
(4, 'Rubik Mofangjiaoshi Meilong 3x3 M Stickerless có nam châm (SP006076)', 'https://res.cloudinary.com/dzweargsr/image/upload/v1742116765/product1_v8ld4w.jpg', 50, 120000, 'Khối Rubik 3x3 MoYu MeiLong 3M Có Nam Châm (Hãng Mod M)

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
(5, 'Rubik 3x3 GAN 356 M Stickerless with  GES+ (Cao cấp có nam châm)', 'https://res.cloudinary.com/dzweargsr/image/upload/v1742116766/product4_vjiwxf.jpg', 30, 590000, 'Rubik 4x4 mượt mà', 'hiện'),
(6, 'Rubik Gan 356 RS stickerless 3x3x3 (SP004254)', 'https://res.cloudinary.com/dzweargsr/image/upload/v1742116766/product2_j9clmu.jpg', 20, 350000, 'Rubik tam giác dễ chơi', 'hiện');

-- Thêm 3 bản ghi cho Buy_invoices
INSERT INTO Buy_invoices (id_supplier, id_employee, `desc`, total) VALUES
(1, 1, 'Nhập lô Rubik 3x3', 5000000),
(2, 2, 'Nhập lô Rubik 4x4', 7000000),
(3, 3, 'Nhập lô Pyraminx', 3000000);


-- Thêm 3 bản ghi cho Buy_invoice_details
INSERT INTO Buy_invoice_details (id_buy_invoice, id_product, quantity, price) VALUES
(1, 1, 20, 200000),
(2, 2, 15, 300000),
(3, 3, 10, 120000);

INSERT INTO Buy_invoice_details (id_buy_invoice, id_product, quantity, price) VALUES
(1, 3, 20, 200000);

-- Thêm 3 bản ghi cho Carts
INSERT INTO Carts (id_customer, id_product, quantity, price) VALUES
(1, 1, 2, 250000),
(2, 2, 1, 350000),
(3, 3, 3, 150000);

-- Thêm 3 bản ghi cho Sale_invoices
INSERT INTO Sale_invoices (id_customer, `desc`, total, pay) VALUES
(1, 'Mua Rubik 3x3', 500000, 'COD'),
(2, 'Mua Rubik 4x4', 350000, 'QR'),
(3, 'Mua Pyraminx', 450000, 'COD');

-- Thêm 3 bản ghi cho Sale_invoice_details
INSERT INTO Sale_invoice_details (id_sale_invoice, id_product, quantity, price) VALUES
(1, 1, 2, 250000),
(2, 2, 1, 350000),
(3, 3, 3, 150000);
