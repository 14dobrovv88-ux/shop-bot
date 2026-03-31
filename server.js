const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.static(".")); //
app.use(express.json());

let products = [];
let orders = [];

// ===== ТОВАРЫ =====
app.get("/products", (req, res) => {
  res.send(products);
});

app.get("/add-test", (req, res) => {
  products.push({
    name: "LED лампа",
    price: 299
  });
  res.send("Товар добавлен");
});

// ===== LIQPAY =====
function sign(data, privateKey) {
  const base64 = Buffer.from(JSON.stringify(data)).toString("base64");
  const str = privateKey + base64 + privateKey;
  return {
    data: base64,
    signature: crypto.createHash("sha1").update(str).digest("base64")
  };
}

app.post("/pay", (req, res) => {
  const total = 100;

  const data = {
    public_key: process.env.LIQPAY_PUBLIC_KEY,
    version: "3",
    action: "pay",
    amount: total,
    currency: "UAH",
    description: "Оплата заказа",
    order_id: "order_" + Date.now(),
    server_url: process.env.RENDER_EXTERNAL_URL + "/webhook",
    result_url: process.env.RENDER_EXTERNAL_URL
  };

  const s = sign(data, process.env.LIQPAY_PRIVATE_KEY);
  res.send({ ...s, url: "https://www.liqpay.ua/api/3/checkout" });
});

// ===== WEBHOOK =====
app.post("/webhook", (req, res) => {
  console.log("Оплата прошла");
  res.send("ok");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server started");
});
