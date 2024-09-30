// This file was adapated from the starter code.

// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

PORT        = 3537;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/

// Home screen render
app.get('/', function(req, res)
{
    res.render('home');
})

// Customer screen render
app.get('/customers', function(req, res)
{
    let query1 = `SELECT * FROM Customers;`;
    db.pool.query(query1, function(error, rows, fields){
        res.render('customers', {data: rows});
    });
})

// Add a new customer
app.post('/add-customer-form', function(req, res)
{
    let data = req.body;

    let query1 = `
        INSERT INTO Customers (firstName, lastName, email, phone, address)
        VALUES (?, ?, ?, ?, ?);
    `;

    db.pool.query(query1, [data.firstName, data.lastName, data.email, data.phone, data.address], function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong,
            // and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/customers');
        }
    })
});

// Delete a customer
app.delete('/delete-customer-ajax/', function(req, res, next){
    let data = req.body;

    let customerID = parseInt(data.customerID);
    // Check if the ID was a valid integer, and send an error status if not
    if (isNaN(customerID)) {
        res.sendStatus(400);
        return;
    }

    let query1 = `
        DELETE FROM Customers
        WHERE customerID = ?;
    `;

    db.pool.query(query1, [customerID], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// Update a customer
app.put('/put-customer-ajax/', function(req,res,next){
    let data = req.body;

    let customerID = parseInt(data.customerID);
    // Check if the ID was a valid integer, and send an error status if not
    if (isNaN(customerID))
    {
        console.log("Bad customerID to /put-customer-ajax");
        res.sendStatus(400);
        return;
    }

    let query1 = `
        UPDATE Customers SET
            firstName = ?,
            lastName = ?,
            email = ?,
            phone = ?,
            address = ?
        WHERE customerID = ?;
    `;

    // Run the 1st query
    db.pool.query(query1, [data.firstName, data.lastName, data.email, data.phone, data.address, customerID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong,
            // and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            res.sendStatus(204);
        }
    })
});

// Order screen
app.get('/orders', function(req, res)
{
    let query1 = `
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
    `;
    let query2 = `SELECT customerID, firstName, lastName FROM Customers;`
    db.pool.query(query1, function(error, rows, fields){
        let orders = rows;
        db.pool.query(query2, function(error, rows, fields){
            let customers = rows;
            res.render('orders', {data: orders, customers: customers});
        });
    });
})

// Create a new order
app.post('/add-order-form', function(req, res)
{
    let data = req.body;

    let customerID = parseInt(data['input-customerID']);
    // Check if the ID was a valid integer, and send an error status if not
    if (isNaN(customerID))
    {
        customerID = null;
    }
    // Allow nullable customerID, understanding ID 0 as null, since counting starts after it
    if (customerID == 0)
    {
        customerID = null;
    }

    let orderDate = data['input-orderDate'];

    let query1 = `
        INSERT INTO Orders (customerID, orderDate)
        VALUES (?, ?);
    `;

    db.pool.query(query1, [customerID, orderDate], function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/orders');
        }
    })
});

// Delete order
app.delete('/delete-order-ajax/', function(req,res,next){
    let data = req.body;

    let orderID = parseInt(data.orderID);
    // Check if the ID was a valid integer, and send an error status if not
    if (isNaN(orderID))
    {
        console.log("Bad orderID to /delete-order-ajax");
        res.sendStatus(400);
        return;
    }

    let query1 = `
        DELETE FROM Orders
        WHERE orderID = ?;
    `;

    // Run the 1st query
    db.pool.query(query1, [orderID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong,
            // and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            res.sendStatus(204);
        }
    })
});

// Update order
app.put('/put-order-ajax/', function(req,res,next){
    let data = req.body;

    let orderID = parseInt(data.orderID);
    // Check if the ID was a valid integer, and send an error status if not
    if (isNaN(orderID))
    {
        console.log("Bad orderID to /put-order-ajax");
        res.sendStatus(400);
        return;
    }

    let customerID = parseInt(data.customerID);
    // Check if the ID was a valid integer, and send an error status if not
    if (isNaN(customerID))
    {
        console.log("Bad customerID to /put-order-ajax");
        res.sendStatus(400);
        return;
    }
    // Allow nullable customerID, understanding ID 0 as null, since counting starts after it
    if (customerID == 0)
    {
        customerID = null;
    }

    let orderDate = data.orderDate;

    let query1 = `
        UPDATE Orders SET
            customerID = ?,
            orderDate = ?
        WHERE orderID = ?;
    `;

    // Run the 1st query
    db.pool.query(query1, [customerID, orderDate, orderID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong,
            // and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            res.sendStatus(204);
        }
    })
});

// Products screen
app.get('/products', function(req, res)
{
    let query1 = `SELECT * FROM Products;`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            let products = rows;
            res.render('products', {data: products});
        }
    });
})

// Create new product
app.post('/add-product-form', function(req, res)
{
    let data = req.body;

    let productName = data['input-productName'];
    let description = data['input-description'];
    let price = parseFloat(data['input-price']);
    let inventory = parseInt(data['input-inventory']);
    
    // Check that both the price and the inventory count are valid numbers, send error if not
    if (isNaN(price) || isNaN(inventory)) {
        res.sendStatus(400);
        return;
    }

    let query1 = `
        INSERT INTO Products (productName, description, price, inventory)
        VALUES (?, ?, ?, ?);
    `;

    db.pool.query(query1, [productName, description, price, inventory], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/products');
        }
    });
});

// Update product
app.put('/put-product-ajax', function(req, res, next){
    let data = req.body;

    let productID = parseInt(data.productID);
    let productName = data.productName;
    let description = data.description;
    let price = parseFloat(data.price);
    let inventory = parseInt(data.inventory);

    // Make sure all numerical values are parsable as numbers, send error if not
    if (isNaN(productID) || isNaN(price) || isNaN(inventory)) {
        res.sendStatus(400);
        return;
    }

    let query1 = `
        UPDATE Products SET
            productName = ?,
            description = ?,
            price = ?,
            inventory = ?
        WHERE productID = ?;
    `;

    db.pool.query(query1, [productName, description, price, inventory, productID], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// Delete product
app.delete('/delete-product-ajax/', function(req, res, next){
    let data = req.body;

    let productID = parseInt(data.productID);
    // Check if the ID was a valid integer, and send an error status if not
    if (isNaN(productID)) {
        res.sendStatus(400);
        return;
    }

    let query1 = `
        DELETE FROM Products
        WHERE productID = ?;
    `;

    db.pool.query(query1, [productID], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});


// Suppliers screen
app.get('/suppliers', function(req, res)
{
    let query1 = `SELECT * FROM Suppliers;`

    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            console.log(rows); // Log the rows to the console
            let suppliers = rows;
            res.render('suppliers', {data: suppliers});
        }
    });
})

// Create supplier
app.post('/add-supplier-form', function(req, res)
{
    let data = req.body;

    let companyName = data['input-supplierName'];
    let email = data['input-email'];
    let phone = data['input-phone'];
    let address = data['input-address'];

    let query1 = `
        INSERT INTO Suppliers(companyName, email, phone, address)
        VALUES (?, ?, ?, ?);
        `

    db.pool.query(query1, [companyName, email, phone, address], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/suppliers');
        }
    });
});

// Update supplier
app.put('/put-supplier-ajax', function(req, res, next)
{
    let data = req.body;

    let supplierID = parseInt(data.supplierID);
    let supplierName = data.companyName;
    let email = data.email;
    let phone = data.phone;
    let address = data.address;

    if (isNaN(supplierID)) {
        res.sendStatus(400);
        return;
    }

    let query1 = `
        UPDATE Suppliers SET
            companyName = ?,
            email = ?,
            phone = ?,
            address = ?
        WHERE supplierID = ?;
    `;

    db.pool.query(query1, [supplierName, email, phone, address, supplierID], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });


});

// Delete supplier
app.delete('/delete-supplier-ajax/', function(req, res, next){
    let data = req.body;

    let supplierID = parseInt(data.supplierID);
    if (isNaN(supplierID)) {
        res.sendStatus(400);
        return;
    }

    let query1 = `
        DELETE FROM Suppliers
        WHERE supplierID = ?;
    `;

    db.pool.query(query1, [supplierID], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// ProductSuppliers screen
app.get('/productsuppliers', function(req, res)
{
    // Main table display
    let query1 = `
        SELECT ps.productID AS productID,
        s.supplierID AS supplierID,
        CONCAT(ps.productID, '-', s.supplierID) AS productSupplierID,
        p.productName AS productName,
        s.companyName AS companyName
        FROM ProductSuppliers AS ps
        JOIN Products p ON ps.productID = p.productID
        JOIN Suppliers s ON ps.supplierID = s.supplierID
        ORDER BY ps.productID ASC, s.supplierID ASC;
    `;

    // Products dropdown menu
    let query2 = `SELECT productID, productName FROM Products;`;
    // Suppliers dropdown menu
    let query3 = `SELECT supplierID, companyName FROM Suppliers;`;

    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error);
            return res.sendStatus(500).send('Internal Server Error');
        }
        let ps = rows

        db.pool.query(query2, function(error, rows, fields){
            if (error) {
                console.error('Error executing query2', error);
                return res.status(500).send('Internal Server Error');
            }
            let products = rows;

            db.pool.query(query3, function(error, rows, fields) {
                if (error) {
                    console.error('Error executing query3', error);
                    return res.status(500).send('Internal Server Error');
                }
                let suppliers = rows;

                return res.render('productsuppliers', {
                    data: ps,
                    products: products,
                    suppliers: suppliers,
                    helpers: {
                        inc: function(value) {
                            return parseInt(value) + 1;
                        }
                    }
                });
            });
        });
    });
});

// Create ProductSuppliers M:M relationship
app.post('/add-product-suppliers-form/', function(req, res, next) {
    let data = req.body;

    let productID = parseInt(data['input-productName']);
    let supplierID = parseInt(data['input-supplierName']);

    // Check if the IDs were valid integers, and send an error status if not
    if (isNaN(productID) || isNaN(supplierID))
    {
        console.log("Bad ID to /add-product-suppliers-form");
        res.sendStatus(400);
        return;
    }

    // Check if the entry already exists
    let query1 = `
        SELECT * FROM ProductSuppliers
        JOIN Products ON ProductSuppliers.productID = Products.productID
        JOIN Suppliers ON ProductSuppliers.supplierID = Suppliers.supplierID
        WHERE Products.productID = ? AND Suppliers.supplierID = ?;
    `;

    db.pool.query(query1, [productID, supplierID], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }

        // If the entry exists, send an error response
        if (rows.length > 0) {
            res.status(400).send("Duplicate entry");
            return;
        }

        let query2 = `
            INSERT INTO ProductSuppliers (productID, supplierID)
            SELECT p.productID, s.supplierID
            FROM Products p
            JOIN Suppliers s ON p.productID = ? AND s.supplierID = ?;
        `;

        db.pool.query(query2, [productID, supplierID], function(error, rows, fields){

            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                res.redirect('/productsuppliers');
            }
        });
    });
});

// Delete ProductSuppliers M:M
app.delete('/delete-ps-ajax/', function(req,res,next){
    let data = req.body;

    let supplierID = parseInt(data.supplierID);
    let productID = parseInt(data.productID);

    // Check if the IDs were valid integers, and send an error status if not
    if (isNaN(productID) || isNaN(supplierID))
    {
        console.log("Bad ID to /add-product-suppliers-form");
        res.sendStatus(400);
        return;
    }

    let query1 = `
        DELETE FROM ProductSuppliers
        WHERE productID = ?
        AND supplierID = ?;
    `;

    // Run the 1st query
    db.pool.query(query1, [productID, supplierID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong,
            // and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            res.sendStatus(204);
        }
    })
});

// OrderProductDetails screen

app.get('/orderproducts', function(req, res)    
{
    let query1 = `
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
    `;
    let query2 = `SELECT productID, productName FROM Products;`;
    let query3 = `SELECT orderID FROM Orders;`;

    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.error('Error executing query1', error);
            return res.status(500).send('Internal Server Error');
        }
        let opd = rows;

        db.pool.query(query2, function(error, rows, fields){
            if (error) {
                console.error('Error executing query2', error);
                return res.status(500).send('Internal Server Error');
            }
            let products = rows;

            db.pool.query(query3, function(error, rows, fields) {
                if (error) {
                    console.error('Error executing query3', error);
                    return res.status(500).send('Internal Server Error');
                }
                let orders = rows;

                return res.render('orderproducts', {data: opd, products: products, orders: orders});
            });
        });
    });
});

// Add OrderProductDetails M:M
app.post('/add-opd-form', function(req, res)
{
    let data = req.body;

    let orderID = parseInt(data['input-orderid']);
    // Check if the ID was a valid integer, and send an error status if not
    if (isNaN(orderID))
    {
        orderID = 'NULL'
    }

    let productID = parseInt(data['input-productid']);
    // Check if the ID was a valid integer, and send an error status if not
    if (isNaN(productID))
    {
        productID = 'NULL'
    }

    let quantity = parseInt(data['input-quantity']);
    // Check if the quantity was a valid integer, and send an error status if not
    if (isNaN(quantity))
    {
        quantity = 'NULL'
    }

    let query1 = `
        INSERT INTO OrderProductDetails (orderID, productID, quantity)
        VALUES (?, ?, ?);
    `;

    db.pool.query(query1, [orderID, productID, quantity], function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/');
        }
    })
});

// Delete OrderProductDetails M:M
app.delete('/delete-opd-ajax/', function(req,res,next){
    let data = req.body;

    let orderID = parseInt(data.orderID);
    // Check if the ID was a valid integer, and send an error status if not
    if (isNaN(orderID))
    {
        console.log("Bad orderID to /delete-opd-ajax");
        res.sendStatus(400);
        return;
    }

    let productID = parseInt(data.productID);
    // Check if the ID was a valid integer, and send an error status if not
    if (isNaN(productID))
    {
        console.log("Bad productID to /delete-opd-ajax");
        res.sendStatus(400);
        return;
    }

    let query1 = `
        DELETE FROM OrderProductDetails
        WHERE orderID = ?
        AND productID = ?;
    `;

    // Run the 1st query
    db.pool.query(query1, [orderID, productID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong,
            // and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            res.sendStatus(204);
        }
    })
});

// Update OrderProductDetails M:M
app.put('/put-opd-ajax/', function(req,res,next){
    let data = req.body;

    console.log("data received: ", data);

    let orderID = parseInt(data.orderID);
    // Check if the ID was a valid integer, and send an error status if not
    if (isNaN(orderID))
    {
        console.log("Bad orderID to /update-opd-ajax");
        res.sendStatus(400);
        return;
    }

    let productID = parseInt(data.productID);
    // Check if the ID was a valid integer, and send an error status if not
    if (isNaN(productID))
    {
        console.log("Bad productID to /update-opd-ajax");
        res.sendStatus(400);
        return;
    }

    let quantity = parseInt(data.quantity);
    // Check if the quantity was a valid integer, and send an error status if not
    if (isNaN(quantity))
    {
        console.log("Bad quantity to /update-opd-ajax");
        res.sendStatus(400);
        return;
    }

    let query1 = `
        UPDATE OrderProductDetails SET quantity = ?
        WHERE orderID = ?
        AND productID = ?;
    `;

    // Run the 1st query
    db.pool.query(query1, [quantity, orderID, productID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong,
            // and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            res.sendStatus(204);
        }
    })
});


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

