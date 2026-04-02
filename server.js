const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.static("."));
app.use(express.json());

// ===== ТОВАРЫ =====
app.get("/products", (req, res) => {
  const data = fs.readFileSync("products.json");
  res.json(JSON.parse(data));
});

// ===== ЗАКАЗ =====
app.post("/order", (req, res) => {
  const order = req.body;

  const orders = JSON.parse(fs.readFileSync("orders.json", "utf-8") || "[]");

  orders.push({
    ...order,
    date: new Date()
  });

  fs.writeFileSync("orders.json", JSON.stringify(orders, null, 2));

  console.log("Новый заказ:", order);

  res.send({ success: true });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server started");
});
