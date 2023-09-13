import React, { useState } from "react";
import Navigation from "../organisms/Navigation/Navigation";

const MainTemplate = ({ children }) => {
  return (
    <div className="w-full flex">
      <Navigation />
      <div className="px-12 py-10 flex flex-col gap-8">{children}</div>
    </div>
  );
};

export default MainTemplate;
