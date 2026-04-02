const express = require("express");
const fs = require("fs");
const axios = require("axios");

const app = express();

app.use(express.static("."));
app.use(express.json());

const TOKEN = "ВСТАВЬ_ТГ_ТОКЕН";
const CHAT_ID = "ВСТАВЬ_CHAT_ID";

// товары
app.get("/products", (req, res) => {
  const data = fs.readFileSync("products.json");
  res.json(JSON.parse(data));
});

// заказ
app.post("/order", async (req, res) => {
  const order = req.body;

  let orders = [];
  try {
    orders = JSON.parse(fs.readFileSync("orders.json"));
  } catch {}

  orders.push(order);
  fs.writeFileSync("orders.json", JSON.stringify(orders, null, 2));

  const text = `
🛒 Нове замовлення

👤 ${order.name}
📞 ${order.phone}
🏠 ${order.address}

📦 Товари:
${order.cart.map(p => `- ${p.name} (${p.price} грн)`).join("\n")}
`;

  if (TOKEN !== "ВСТАВЬ_ТГ_ТОКЕН") {
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text
    });
  }

  res.send({ success: true });
});

app.listen(process.env.PORT || 3000);
