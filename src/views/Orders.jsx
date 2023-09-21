import React, { useEffect, useState } from "react";
import Title from "../components/atoms/Title";
import { products } from "../mocks/data/products";
import pl from "date-fns/locale/pl";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("pl", pl);

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

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getFirstDayOfMonth = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return formatDateForAPI(firstDayOfMonth);
  };

  // const [startDate, setStartDate] = useState(new Date(getFirstDayOfMonth()));
  // const [endDate, setEndDate] = useState(new Date());

  const [startDate, setStartDate] = useState(new Date(getFirstDayOfMonth()));
  const [endDate, setEndDate] = useState(new Date());
  const [startDateForAPI, setStartDateForAPI] = useState(
    formatDateForAPI(new Date(getFirstDayOfMonth()))
  );
  const [endDateForAPI, setEndDateForAPI] = useState(
    formatDateForAPI(new Date())
  );

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setStartDateForAPI(formatDateForAPI(start));
    setEndDateForAPI(formatDateForAPI(end));
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
  }, [page, perPage, endDate]);

  const fetchOrders = () => {
    setLoading(true);
    const url = `https://cors-anywhere.herokuapp.com/https://piesolandia.pl/wp-json/wc/v3/orders?per_page=${perPage}&page=${page}&status=completed&after=${startDateForAPI}T00:00:00&before=${endDateForAPI}T23:59:59`;
    const consumerKey = import.meta.env.VITE_WC_CK;
    const consumerSecret = import.meta.env.VITE_WC_CS;

    // Tworzymy nagłówek autoryzacyjny w formacie Basic Auth
    const base64 = btoa(`${consumerKey}:${consumerSecret}`);
    const headers = new Headers({
      Authorization: `Basic ${base64}`,
    });

    // Wykonujemy zapytanie GET do WooCommerce API
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

  const filterProducts = (order, typeOfData) => {
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

  const getProductById = (productId) => {
    return products.find((product) => product.id === productId);
  };

  const profitCalc = (price, shippingPrice, productIds, quantities) => {
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

  const shippingPrice = (method) => {
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

  const calculateTotalShippingCost = (orders) => {
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

  const calculateTotalOrderPrice = (orders) => {
    return orders
      .reduce((total, order) => {
        total += parseFloat(order.total);
        return total;
      }, 0)
      .toFixed(2);
  };

  const calculateTotalProfit = (orders) => {
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
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            locale="pl"
            withPortal
            className="select select-bordered"
          />
        </div>
      </div>
      <div className="overflow-x-auto p-4 bg-base-300">
        <table className="table table-sm border-spacing-2">
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
                    <td>
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
              <tfoot>
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
        <button className="join-item btn">{page}</button>
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
