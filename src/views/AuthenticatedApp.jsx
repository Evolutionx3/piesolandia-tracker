import { Navigate, Route, Routes } from "react-router-dom";
import MainTemplate from "../components/templates/MainTemplate";
import Overview from "./Overview";
import Orders from "./Orders";
import Profit from "./Profit";
import Expenses from "./Expenses";
import Stock from "./Stock";

const AuthenticatedApp = () => {
  return (
    <MainTemplate>
      <Routes>
        <Route path="/" exact element={<Overview />} />
        <Route path="/zamowienia" exact element={<Orders />} />
        <Route path="/profit" exact element={<Profit />} />
        <Route path="/wydatki" exact element={<Expenses />} />
        <Route path="/stan-magazynowy" exact element={<Stock />} />
      </Routes>
    </MainTemplate>
  );
};

export default AuthenticatedApp;
