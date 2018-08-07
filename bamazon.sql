DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    Product_name VARCHAR(100) NOT NULL,
    Department_name VARCHAR(32) NOT NULL,
    Price INTEGER(10) NOT NULL,
    Stock_quantity INTEGER(10) NOT NULL
);

INSERT INTO products (id, Product_name, Department_name, Price, Stock_quantity)
VALUES(1, "Arizona Green Tea w/ Gingseng", "Grocery & Gourmet Food",7, 77),
(2, "COSORI 8 Quart 8-in-1 Multi-Functional Programmable Pressure Cooker, Slow Cooker, Rice Cooker", "Home & Kitchen",80, 40),
(3, "Orgain Organic Protein", "Grocery & Gourmet Food",31, 1),
(4, "'ASUS ROG Strix 27 in Curved Full HD Gaming Monitor'", "Electronics",335, 3),
(5, "Sennheiser PXC 550 Wireless-Adaptive Noise Cancelling Bluetooth Headphones", "Electronics",346, 60),
(6, "Acer Predator Triton 700 Ultra-Thin Gaming Laptop 15.6 inches", "Electronics",2299, 46),
(7, "Casio F91W-1 Classic Resin Strap Digital Sport Watch", "Men Clothing, Shoes & Jewelry",7, 24),
(8, "Guess Men GU6591 Aviator Fashion Sunglasses", "Men Clothing, Shoes & Jewelry",20, 100),
(9, "AGS Certified I1-I2 14K Diamond Stud Earrings White Gold", "Women Clothing, Shoes & Jewelry",380, 50),
(10, "Sterling Silver Celtic Triquetra Knot Triangle Drop Wire Earrings", "Women Clothing, Shoes & Jewelry",20, 90),
(11, "iRobot Roomba 690 Robot Vacuum with Wi-Fi Connectivity", "Home & Kitchen",297, 30);

CREATE TABLE users(
	UserID INT NOT NULL AUTO_INCREMENT,
    Email VARCHAR(32) NOT NULL,
    Password CHAR(32) NOT NULL,
    Username VARCHAR(32),
    Orders INTEGER(32),
    primary key(UserID)
);

INSERT INTO users(UserID, Email, Password, Username, Orders)
VALUES( 1,"example@gmail.com", md5("123456789"), "Databaseguy1", 0);

CREATE TABLE managers(
	UserID INT NOT NULL AUTO_INCREMENT,
    Email VARCHAR(80) NOT NULL,
    Password CHAR(32) NOT NULL,
    Username VARCHAR(50) NOT NULL,
    Orders INTEGER(50),
    primary key(UserID)
);

INSERT INTO managers(UserID, Email, Password, Username, Orders)
VALUES( 1,"example@gmail.com", md5("123456789"), "Databaseguy1" , 0);