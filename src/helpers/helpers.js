import { products } from "../mocks/data/products";

export const formatDateForAPI = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getFirstDayOfMonth = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return formatDateForAPI(firstDayOfMonth);
};

export const calculateTotalOrderPrice = (orders) => {
  return orders
    .reduce((total, order) => {
      total += parseFloat(order.total);
      return total;
    }, 0)
    .toFixed(2);
};

export const getProductById = (productId) => {
  return products.find((product) => product.id === productId);
};

export const profitCalc = (price, shippingPrice, productIds, quantities) => {
  let totalProfit = parseFloat(price);

  productIds.forEach((productId, index) => {
    const product = getProductById(productId);

    if (product) {
      const wholesalePrice = parseFloat(product.wholesale_price);
      const quantity = parseFloat(quantities[index]);

      if (!isNaN(wholesalePrice) && !isNaN(quantity)) {
        totalProfit -= wholesalePrice * quantity;
      }
    }
  });

  totalProfit -= parseFloat(shippingPrice);

  return totalProfit.toFixed(2);
};

export const shippingPrice = (method) => {
  switch (method) {
    case "12":
    case "2":
    case "6": //paczkomat
      return 14.02;
    case "4": // kurier
      return 15.73;
    case "13": //pobranie
      return 18.79;
  }
};

export const calculateTotalShippingCost = (orders) => {
  return orders
    .reduce((total, order) => {
      if (order.shipping_lines.length > 0) {
        const shippingCost = parseFloat(
          shippingPrice(order.shipping_lines[0].instance_id)
        );
        if (!isNaN(shippingCost)) {
          total += shippingCost;
        }
      }
      return total;
    }, 0)
    .toFixed(2);
};

export const filterProducts = (order, typeOfData) => {
  return order.line_items
    .filter((item) => item.price !== 0)
    .map((item) => {
      if (typeOfData === "product_id") {
        return item.product_id;
      } else if (typeOfData === "quantity") {
        return item.quantity;
      }
      return null;
    });
};

export const calculateTotalProfit = (orders) => {
  return orders
    .reduce((total, order) => {
      const orderProfit = profitCalc(
        parseFloat(order.total),
        parseFloat(shippingPrice(order.shipping_lines[0].instance_id)),
        filterProducts(order, "product_id"),
        filterProducts(order, "quantity")
      );
      total += parseFloat(orderProfit);
      return total;
    }, 0)
    .toFixed(2);
};
