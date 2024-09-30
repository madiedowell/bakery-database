-- Disable foreign key checks to avoid issues during table creation and data insertion
SET FOREIGN_KEY_CHECKS=0;

-- Disable autocommit to ensure all changes are committed together
SET AUTOCOMMIT = 0;

-- Create the Customers table with necessary fields with a primary key
CREATE OR REPLACE TABLE Customers (
    customerID int NOT NULL AUTO_INCREMENT,
    firstName varchar(45),
    lastName varchar(45),
    email varchar(255),
    phone varchar(45),
    address varchar(255),
    PRIMARY KEY (customerID)
);

-- Create the Products table with necessary fields with a primary key
CREATE OR REPLACE TABLE Products (
    productID int NOT NULL AUTO_INCREMENT,
    productName varchar(45),
    description text,
    price decimal(18,2),
    inventory int,
    PRIMARY KEY (productID)
);

-- Create the Orders table with necessary fields, a primary key, and a foreign key referencing Customers
CREATE OR REPLACE TABLE Orders (
    orderID int NOT NULL AUTO_INCREMENT,
    customerID int,
    orderDate datetime,
    PRIMARY KEY (orderID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID)
);

-- Create the OrderProductDetails table with necessary fields, a composite primary key, and foreign keys referencing Orders and Products
CREATE OR REPLACE TABLE OrderProductDetails (
    orderID int NOT NULL,
    productID int NOT NULL,
    quantity int NOT NULL,
    PRIMARY KEY (orderID, productID),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID) ON DELETE CASCADE,
    FOREIGN KEY (productID) REFERENCES Products(productID) ON DELETE CASCADE
);

-- Create the Suppliers table with necessary fields and a primary key
CREATE OR REPLACE TABLE Suppliers (
    supplierID int NOT NULL AUTO_INCREMENT,
    companyName varchar(45),
    email varchar(255),
    phone varchar(45),
    address varchar(255),
    PRIMARY KEY (supplierID)
);

-- Create the ProductSuppliers table with necessary fields, a composite primary key, and foreign keys referencing Products and Suppliers
CREATE OR REPLACE TABLE ProductSuppliers (
    productID int NOT NULL,
    supplierID int NOT NULL,
    PRIMARY KEY (productID, supplierID),
    FOREIGN KEY (productID) REFERENCES Products(productID) ON DELETE CASCADE,
    FOREIGN KEY (supplierID) REFERENCES Suppliers(supplierID) ON DELETE CASCADE
);

-- Insert sample data into the Customers table
INSERT INTO Customers (firstName, lastName, email, phone, address)
VALUES ('Alice', 'Smith', 'asmith@example.com', '555-1234', '123 Van Buren St'),
('Bob', 'Wilhelm', 'bwilhelm@example.com', '555-8364', '300 Lincoln St'),
('Charlotte', 'Johnson', 'cjohnson@example.com', '555-7532', '999 Washington St');

-- Insert sample data into the Products table
INSERT INTO Products (productName, description, price, inventory)
VALUES ('Cake', 'With icing', 18.5, 5),
('Cupcake', 'Chocolate and vanilla', 5.0, 24),
('Croissant', 'Brushed with butter', 3.25, 12);

-- Insert sample data into the Orders table
INSERT INTO Orders (orderID, customerID, orderDate)
VALUES (1, 2, '2024-01-13'),
(2, 1, '2024-03-21'),
(3, 3, '2024-04-03');

-- Insert sample data into the OrderProductDetails table
INSERT INTO OrderProductDetails (orderID, productID, quantity)
VALUES (1, 3, 2),
(1, 2, 1),
(2, 1, 1),
(3, 2, 12),
(3, 3, 6);

-- Insert sample data into the Suppliers table
INSERT INTO Suppliers (companyName, email, phone, address)
VALUES ('French Food Ltd', 'ffltd@example.com', '555-6373', '400 Paris St'),
('Mini Cakes Company', 'mcc@example.com', '555-2237', '600 Little St'),
('Cake Corporation', 'ccorp@example.com', '555-9273', '432 Dessert St');

-- Insert sample data into the ProductSuppliers table
INSERT INTO ProductSuppliers (productID, supplierID)
VALUES (3, 1), (2, 2), (2, 3), (1, 3);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;

-- Commit the transaction to save all changes
COMMIT;
