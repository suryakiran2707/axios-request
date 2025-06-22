// checkStockAPI.js
const axios = require('axios');

const PRODUCT_ID = '66604f96d4be68c55752933c'; // example product ID

const PRODUCT_API = `https://shop.amul.com/entity/ms.products/${PRODUCT_ID}`;

async function checkProductStock() {
  try {
    const response = await axios.get(PRODUCT_API);
    const product = response.data;

    // Check if stock is available based on known property, like `isAvailable`, `stock`, etc.
    var timeAgoCalculated = timeAgo(product?.last_order_date);
    if (timeAgoCalculated.includes('minutes')) {
      console.log('✅ Product is back in stock!');
    } else {
      console.log('❌ Product is still out of stock. '+timeAgoCalculated);
    }
  } catch (err) {
    console.error('Error fetching product data:', err.message);
  }
}

function timeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);

  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 0) {
    return `${diffDay} day(s) ago`;
  } else if (diffHr > 0) {
    return `${diffHr} hour(s) ago`;
  } else if (diffMin > 0) {
    return `${diffMin} minute(s) ago`;
  } else {
    return `${diffSec} second(s) ago`;
  }
}

checkProductStock();
