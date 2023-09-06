import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const pages = [
  { id: 1, title: "Przegląd", img: "overview.svg" },
  { id: 2, title: "Zamówienia", img: "orders.svg" },
  { id: 3, title: "Profit", img: "stonks.svg" },
  { id: 4, title: "Wydatki", img: "expenses.svg" },
  { id: 5, title: "Stan magazynowy", img: "boxes.svg" },
];

const AuthenticatedApp = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  const [expanded, setExpanded] = useState(true);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="w-full flex">
      <div
        className={`${
          expanded ? "w-64 px-4" : "w-16 px-2"
        } transition-all duration-300 py-10 bg-base-300 h-screen border-r border-neutral flex flex-col items-start justify-between gap-10 relative`}
      >
        {expanded ? (
          <>
            <div className="flex flex-col gap-8 w-full transition-all duration-300">
              <div className="flex items-center ">
                <img src="sygnet.png" className="w-16" />
              </div>
              <ul className="flex flex-col w-full gap-2">
                {pages.map((page) => (
                  <li key={page.id} className="menu-item-expanded">
                    <img src={page.img} className="w-7" />
                    {page.title}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              <button
                className="btn btn-accent w-full text-base-300"
                onClick={handleLogout}
              >
                Wyloguj się
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-8 w-full transition-all duration-300">
              <div className="flex items-center ">
                <img src="sygnet.png" className="w-16" />
              </div>
              <ul className="flex flex-col justify-center items-center w-full gap-4">
                {pages.map((page) => (
                  <li key={page.id} className="menu-item">
                    <img src={page.img} className="w-6" />
                  </li>
                ))}
              </ul>
            </div>
            <button className="w-full" onClick={handleLogout}>
              <img src="logout.svg" className="w-6 mx-auto" />
            </button>
          </>
        )}

        <button
          onClick={handleExpand}
          className="absolute border border-neutral z-50 top-11 -right-4 bg-base-100 p-1 rounded-full transition-colors duration-300 hover:bg-neutral"
        >
          <img
            className="w-5"
            src={expanded ? "arrow-left.svg" : "arrow-right.svg"}
          />
        </button>
      </div>
      <div className="px-12 py-10">
        <div className="w-full">
          <h3 className="text-4xl font-bold tracking-wide">Przegląd</h3>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedApp;
