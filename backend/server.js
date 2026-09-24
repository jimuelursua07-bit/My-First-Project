const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

let products = [
    {
        title: "Ibong Adarna",
        price: "150"
    },
    {
        title: "Alamat ng Bayabas",
        price: "170"
    },
    {
        title: "Biology 101",
        price: "120"
    },
    {
        title: "Alchemist Book",
        price: "90"
    }
];

app.get('/api/product', (req, res) => {
    res.json(products);
});

app.post('/api/product', (req, res) => {
    console.log(req.body);

    products.push(req.body);
    res.json(req.body);
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});   