import React, { useEffect, useState } from "react";
import {
  getFirstDayOfMonth,
  formatDateForAPI,
  calculateTotalOrderPrice,
  calculateTotalProfit,
  calculateTotalShippingCost,
} from "../helpers/helpers";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import Title from "../components/atoms/Title";
import Cards from "../components/molecules/Cards/Cards";

const Overview = () => {
  const [orders, setOrders] = useState([]);
  const currentDate = new Date();
  const formattedDate = format(currentDate, "LLLL yyyy", { locale: pl });

  const [startDateForAPI, setStartDateForAPI] = useState(
    formatDateForAPI(new Date(getFirstDayOfMonth()))
  );
  const [endDateForAPI, setEndDateForAPI] = useState(
    formatDateForAPI(new Date())
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    const url = `https://cors-anywhere.herokuapp.com/https://piesolandia.pl/wp-json/wc/v3/orders?per_page=90&status=completed&after=${startDateForAPI}T00:00:00&before=${endDateForAPI}T23:59:59`;
    const consumerKey = import.meta.env.VITE_WC_CK;
    const consumerSecret = import.meta.env.VITE_WC_CS;

    const base64 = btoa(`${consumerKey}:${consumerSecret}`);
    const headers = new Headers({
      Authorization: `Basic ${base64}`,
    });

    fetch(url, { method: "GET", headers: headers })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Błąd API: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      <Title title="Przegląd" />
      <div className="flex justify-start items-center gap-8">
        <Cards
          date={formattedDate}
          typeOfDate={calculateTotalOrderPrice(orders)}
          icon="orders.svg"
        />
        <Cards
          date={formattedDate}
          typeOfDate={calculateTotalProfit(orders)}
          icon="stonks.svg"
        />
        <Cards
          date={formattedDate}
          typeOfDate={calculateTotalShippingCost(orders)}
          icon="expenses.svg"
        />
      </div>
    </>
  );
};

export default Overview;
