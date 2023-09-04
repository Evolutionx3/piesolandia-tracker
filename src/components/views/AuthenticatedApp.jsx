import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { LuPackage } from "react-icons/lu";
import { BsBarChart } from "react-icons/bs";

const AuthenticatedApp = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-full flex">
      <div className="w-64 py-10 bg-base-300 h-screen border-r border-neutral flex flex-col items-start justify-between gap-10">
        <div className="flex flex-col gap-10 w-full">
          <div className="flex items-center px-4">
            <img src="sygnet.png" className="w-8 mr-2" />
            <p>Dashboard</p>
          </div>
          <ul className="flex flex-col w-full">
            <li className="flex flex-row items-center gap-3 hover:bg-accent hover:text-primary-content transition-all duration-300 cursor-pointer p-4">
              <HiOutlineShoppingCart fontSize="1.25rem" />
              Zamówienia
            </li>
            <li className="flex flex-row items-center gap-3 hover:bg-accent hover:text-primary-content transition-all duration-300 cursor-pointer p-4">
              <LuPackage fontSize="1.25rem" />
              Stan magazynowy
            </li>
            <li className="flex flex-row items-center gap-3 hover:bg-accent hover:text-primary-content transition-all duration-300 cursor-pointer p-4">
              <BsBarChart fontSize="1.25rem" />
              Profit
            </li>
          </ul>
        </div>
        <div className="w-full px-4">
          <button className="btn btn-accent w-full" onClick={handleLogout}>
            Wyloguj się
          </button>
        </div>
      </div>
      <div className="px-6 py-10">
        <h3 className="text-4xl">Zamówienia</h3>
      </div>
    </div>
  );
};

export default AuthenticatedApp;
