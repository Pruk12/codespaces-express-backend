const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const port = process.env.port || 5000;
const app = express();
 
const db = mysql.createConnection({
    host: 'korawit.ddns.net',
    user: 'webapp',
    password: 'secret2024',
    database: 'shop',
    port: 3307
});
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});
 
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});
 
app.get('/', (req, res) => {
    res.send('Hello world');
});
 
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching products');
        }
        res.send(results);
    });
});
 
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send('Invalid ID');
    }
 
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching product');
        }
        if (results.length > 0) {
            res.send(results[0]);
        } else {
            res.status(404).send('Product not found');
        }
    });
});
 
app.post('/api/addproduct', (req, res) => {
    const { name, price, img } = req.body;
 
    if (!name || !price || !img) {
        return res.status(400).send('All fields are required: name, price, and img.');
    }
 
    const sql = 'INSERT INTO products (name, price, img) VALUES (?, ?, ?)';
    db.query(sql, [name, price, img], (err, result) => {
        if (err) {
            console.error("Error inserting product:", err);
            return res.status(500).send('Error cannot add product.');
        }
 
        const newProduct = { id: result.insertId, name, price, img }; // Create the new product object
        console.log("1 record inserted");
        res.send(newProduct); // Send back the newly created product
    });
});
 
// Delete product
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send('Invalid ID');
    }
 
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).send('Error deleting product');
        }
        if (result.affectedRows > 0) {
            res.send('Product deleted successfully');
        } else {
            res.status(404).send('Product not found');
        }
    });
});
 
// Update product
app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price, img } = req.body;
 
    if (isNaN(id) || !name || !price || !img) {
        return res.status(400).send('Invalid input');
    }
 
    const sql = 'UPDATE products SET name = ?, price = ?, img = ? WHERE id = ?';
    db.query(sql, [name, price, img, id], (err, result) => {
        if (err) {
            return res.status(500).send('Error updating product');
        }
        if (result.affectedRows > 0) {
            res.send({ id, name, price, img }); // Return updated product
        } else {
            res.status(404).send('Product not found');
        }
    });
});
 
app.listen(port, () => {
    console.log('Listening on port', "http://localhost:" + port);
});