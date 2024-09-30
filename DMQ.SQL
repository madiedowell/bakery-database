-- Select to populate customer dropdown
SELECT customerID, firstName, lastName FROM Customers;

-- Select to populate product dropdown
SELECT productID, productName FROM Products;

-- Select to populat supplier dropdown
SELECT supplierID, companyName FROM Suppliers;

-- Select for complete customer details
SELECT * FROM Customers;

-- Select for complete product details
SELECT * FROM Products;

-- Select for complete supplier details
SELECT * FROM Suppliers;

-- Select for complete list of orders, with prices
SELECT Orders.orderID AS orderID,
DATE_FORMAT(Orders.orderDate, '%M %d %Y') AS orderDate,
Customers.firstName AS firstName,
Customers.lastName AS lastName,
COALESCE(SUM(prices.mulPrice), 0) AS total
FROM Orders
LEFT JOIN Customers ON Customers.customerID = Orders.customerID
LEFT JOIN OrderProductDetails AS opd ON opd.orderID = Orders.orderID
LEFT JOIN (
    SELECT Products.productID AS productID,
    opd2.orderID AS orderID,
    (Products.price * opd2.quantity) AS mulPrice
    FROM Products
    JOIN OrderProductDetails AS opd2 ON opd2.productID = Products.productID
) AS prices ON
    prices.productID = opd.ProductID
    AND prices.orderID = opd.orderID
GROUP BY Orders.orderID
ORDER BY Orders.orderDate DESC;

-- Select all from OrderProductDetails
SELECT opd.orderID AS orderID,
opd.productID AS productID,
DATE_FORMAT(Orders.orderDate, '%M %d %Y') AS orderDate,
Customers.firstName AS firstName,
Customers.lastName AS lastName,
Products.productName AS productName,
Products.price AS perUnit,
opd.quantity AS quantity,
(Products.price * opd.quantity) AS total
FROM OrderProductDetails AS opd
JOIN Orders ON Orders.orderID = opd.orderID
LEFT JOIN Customers ON Customers.customerID = Orders.customerID
JOIN Products ON Products.productID = opd.productID
ORDER BY orderID ASC;

-- Select all from ProductSuppliers
SELECT ps.productID AS productID,
s.supplierID AS supplierID,
CONCAT(ps.productID, '-', s.supplierID) AS productSupplierID,
p.productName AS productName,
s.companyName AS companyName
FROM ProductSuppliers AS ps
JOIN Products p ON ps.productID = p.productID
JOIN Suppliers s ON ps.supplierID = s.supplierID
ORDER BY ps.productID ASC, s.supplierID ASC;

-- Add a new customer
INSERT INTO Customers (firstName, lastName, email, phone, address)
VALUES (:firstNameInput, :lastNameInput, :emailInput, :phoneInput, :addressInput);

-- Delete a customer
DELETE FROM Customers
WHERE customerID = :customerIDInput;

-- Update a customer
UPDATE Customers SET
    firstName = :firstNameInput,
    lastName = :lastNameInput,
    email = :emailInput,
    phone = :phoneInput,
    address = :addressInput
WHERE customerID = :customerIDInput;

-- Add a new product
INSERT INTO Products (productName, description, price, inventory)
VALUES (:productNameInput, :descriptionInput, :priceInput, :inventoryInput);

-- Update product
UPDATE Products SET
    productName = :productNameInput,
    description = :descriptionInput,
    price = :priceInput,
    inventory = :inventoryInput
WHERE productID = :productIDInput;

-- Delete product
DELETE FROM Products
WHERE productID = ?;

-- Add a new supplier
INSERT INTO Suppliers (companyName, email, phone, address)
VALUES (:companyNameInput, :emailInput, :phoneInput, :addressInput);

-- Update supplier
UPDATE Suppliers SET
    companyName = :companyNameInput,
    email = :emailInput,
    phone = :phoneInput,
    address = :addressInput
WHERE supplierID = :supplierIDInput;

-- Delete supplier
DELETE FROM Suppliers
WHERE supplierID = :supplierIDInput;

-- New order: M:1 relationship with customer
INSERT INTO Orders (customerID, orderDate)
VALUES (:customerIDInput, :orderDateInput);

-- Delete order
DELETE FROM Orders
WHERE orderID = orderIDInput;

-- Update order
UPDATE Orders SET
    customerID = :customerIDInput,
    orderDate = :orderDateInput
WHERE orderID = :orderIDInput;

-- New OrderProductDetails: M:M relationship between order and product
INSERT INTO OrderProductDetails (orderID, productID, quantity)
VALUES (:orderIDInput, :productIDInput, :quantityInput);

-- Update quantity on order details
UPDATE OrderProductDetails SET quantity = :quantityInput
WHERE orderID = :inputOrderID
AND productID = :inputProductID;

-- Delete a OrderProductDetails entry
DELETE FROM OrderProductDetails
WHERE orderID = :inputOrderID
AND productID = :inputProductID;

-- New ProductSuppliers: M:M relationship between product and supplier
INSERT INTO ProductSuppliers (productID, supplierID)
SELECT p.productID, s.supplierID
FROM Products p
JOIN Suppliers s ON p.productID = ? AND s.supplierID = ?;

-- Delete a ProductSuppliers entry
DELETE FROM ProductSuppliers
WHERE productID = :inputProductID
AND supplierID = :inputSupplierID;

-- Check if a ProductSuppliers entry exists
SELECT * FROM ProductSuppliers
JOIN Products ON ProductSuppliers.productID = Products.productID
JOIN Suppliers ON ProductSuppliers.supplierID = Suppliers.supplierID
WHERE Products.productID = :productIDInput AND Suppliers.supplierID = :supplierIDInput;