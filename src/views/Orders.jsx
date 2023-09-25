import React, { useEffect, useState } from "react";
import Title from "../components/atoms/Title";
import {
  formatDateForAPI,
  getFirstDayOfMonth,
  calculateTotalOrderPrice,
  calculateTotalShippingCost,
  profitCalc,
  filterProducts,
  calculateTotalProfit,
  shippingPrice,
} from "../helpers/helpers";

import Datepicker from "react-tailwindcss-datepicker";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage, setPerPage] = useState(20);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [dates, setDates] = useState({
    startDate: new Date(getFirstDayOfMonth()),
    endDate: new Date(),
  });

  const [datesForAPI, setDatesForAPI] = useState({
    startDate: formatDateForAPI(new Date(getFirstDayOfMonth())),
    endDate: formatDateForAPI(new Date()),
  });

  const handleDateChange = (selectedDates) => {
    const { startDate, endDate } = selectedDates;

    const startDateObject = new Date(startDate);
    const endDateObject = new Date(endDate);

    setDates({
      startDate: startDateObject,
      endDate: endDateObject,
    });

    setDatesForAPI({
      startDate: formatDateForAPI(startDateObject),
      endDate: formatDateForAPI(endDateObject),
    });
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    fetchOrders();
    console.log(page, totalPages, perPage);
  }, [page, perPage, dates.endDate]);

  const fetchOrders = () => {
    setLoading(true);
    const url = `https://cors-anywhere.herokuapp.com/https://piesolandia.pl/wp-json/wc/v3/orders?per_page=${perPage}&page=${page}&status=completed&after=${datesForAPI.startDate}T00:00:00&before=${datesForAPI.endDate}T23:59:59`;
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
        const totalPages = response.headers.get("X-WP-TotalPages");
        setTotalPages(totalPages);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setLoading(false);
        setOrders(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePerPageChange = (event) => {
    const selectedPerPage = event.target.value;
    setPerPage(selectedPerPage);
  };

  return (
    <>
      <Title title="Zamówienia" />
      <div className="flex justify-between items-center">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Produktów na stronę</span>
          </label>
          <select
            className="select select-bordered w-full max-w-xs"
            value={perPage}
            onChange={handlePerPageChange}
          >
            <option value="10">10</option>
            <option selected value="20">
              20
            </option>
            <option value="48">48</option>
            <option value="72">72</option>
          </select>
        </div>
        <div>
          <label className="label">
            <span className="label-text">Zakres dat</span>
          </label>
          <Datepicker
            i18n={"pl"}
            value={dates}
            onChange={handleDateChange}
            primaryColor="teal"
            inputClassName="select select-bordered"
            containerClassName="bg-base-300"
          />
        </div>
      </div>
      <div className="overflow-x-auto p-4 bg-base-300">
        <table className="table border-spacing-2">
          {loading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            <>
              <thead>
                <tr>
                  <th></th>
                  <th>Data</th>
                  <th>Produkty</th>
                  <th>Koszt dostawy</th>
                  <th>Cena ogółem</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <th>{order.id}</th>
                    <td>{formatDate(order.date_created)}</td>
                    <td className="max-w-lg">
                      {order.line_items
                        .filter((item) => item.price !== 0)
                        .map((item, index) => (
                          <span key={item.id}>
                            {item.quantity > 1
                              ? `${item.quantity}x ${item.name}`
                              : item.name}
                            {index !== order.line_items.length - 1 ? ", " : ""}
                          </span>
                        ))}
                    </td>
                    <td>
                      {order.shipping_lines.length > 0
                        ? `${shippingPrice(
                            order.shipping_lines[0].instance_id
                          )}zł`
                        : "Brak danych"}
                    </td>
                    <td>{order.total}zł</td>
                    <td>
                      {profitCalc(
                        parseFloat(order.total),
                        parseFloat(
                          shippingPrice(order.shipping_lines[0].instance_id)
                        ),
                        filterProducts(order, "product_id"),
                        filterProducts(order, "quantity")
                      )}
                      zł
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="text-sm">
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>Suma wysyłki: {calculateTotalShippingCost(orders)}zł</td>
                  <td>
                    Suma ceny ogółem: {calculateTotalOrderPrice(orders)}zł
                  </td>
                  <td>Suma profit: {calculateTotalProfit(orders)}zł</td>
                </tr>
              </tfoot>
            </>
          )}
        </table>
      </div>
      <div className="join">
        <button
          onClick={previousPage}
          className={`${page === 1 ? "btn-disabled" : null} join-item btn`}
        >
          «
        </button>
        <span className="join-item btn cursor-default">{page}</span>
        <button
          onClick={nextPage}
          className={`${
            page === parseInt(totalPages) ? "btn-disabled" : null
          } join-item btn`}
        >
          »
        </button>
      </div>
    </>
  );
};

export default Orders;
