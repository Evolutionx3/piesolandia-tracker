import React from "react";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import Title from "../components/atoms/Title";

const Overview = () => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "LLLL yyyy", { locale: pl });
  return (
    <>
      <Title title="Przegląd" />
      <div className="flex justify-center items-center gap-4">
        <div className="p-4 bg-base-300 rounded-lg flex flex-col gap-2">
          <div className="flex justify-between items-center gap-8">
            <h3 className="uppercase font-medium text-lg">Sprzedaż</h3>
            <p className="text-sm">{formattedDate}</p>
          </div>
          <div className="flex gap-2">
            <p className="text-xl">2713 zł</p>
            <p className="text-success">+15%</p>
          </div>
        </div>
        <div>
          <h3>Profit</h3>
        </div>
        <div>
          <h3>Wydatki</h3>
        </div>
      </div>
    </>
  );
};

export default Overview;
