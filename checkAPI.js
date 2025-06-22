const axios = require("axios");

exports.handler = async function (event, context) {
  console.log("✅ Handler invoked");

  try {
    const available = await detectStock();
    console.log("🔍 Stock status:", available);

    if (available) {
      await notifyTelegram("📦 Product now in stock!");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        available,
        time: new Date().toISOString(),
      }),
    };
  } catch (err) {
    console.error("🔴 Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};

async function detectStock() {
  const productId = "68574756c44c83cdd0cdda9e";
  const cartId = "68574756c44c83cdd0cdda9e";
  const url = `https://shop.amul.com/entity/ms.carts/${cartId}/_/addItem?q=${encodeURIComponent(
    JSON.stringify({ _id: productId })
  )}`;

  const response = await axios.put(url, null, {
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true,
  });

  console.log("Amul response:", response.data);
  return response.status === 200 && !response.data?.error;
}

async function notifyTelegram(msg) {
  const token = "your_telegram_bot_token";
  const chatId = "your_chat_id";

  return axios.get(`https://api.telegram.org/bot${token}/sendMessage`, {
    params: { chat_id: chatId, text: msg },
  });
}
