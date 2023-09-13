import React, { useEffect, useState } from "react";
import Title from "../components/atoms/Title";

import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: "http://piesolandia.pl",
  consumerKey: "ck_a629bbccd4c333e1de12707626dd41534dbd9595",
  consumerSecret: "cs_19e3f2356c5e8985235d589e1ce5ff21e7d88ff3",
  version: "wc/v3",
});

const Orders = () => {
  // const [orders, setOrders] = useState([]);

  // useEffect(() => {
  //   fetchOrders();
  // }, []);

  // let fetchOrders = () => {
  //   api
  //     .get("orders", {
  //       per_page: 20,
  //     })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         return response.json();
  //       } else {
  //         throw new Error("Błąd API: " + response.statusText);
  //       }
  //     })
  //     .then((data) => {
  //       console.log(data);
  //       setOrders(data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  return (
    <>
      <Title title="Zamówienia" />
    </>
  );
};

export default Orders;
