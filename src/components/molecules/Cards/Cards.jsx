import React from "react";

const Cards = ({ date, icon, typeOfDate }) => {
  return (
    <div className="p-6 w-1/3 bg-base-300 rounded-lg flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="p-2 bg-neutral rounded-full w-10 h-10">
          <img src={icon} />
        </div>
        <p className="text-sm">{date}</p>
      </div>
      <h3 className="font-medium text-lg">Sprzedaż</h3>
      <div className="flex gap-2">
        <p className="text-xl font-bold">{typeOfDate}zł</p>
      </div>
    </div>
  );
};

export default Cards;
