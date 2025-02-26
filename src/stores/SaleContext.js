import React, { useEffect } from "react";
import { createContext, useState } from "react";
import { getData } from "../apis/apiCalls";
import { GETALLTABLES } from "../constants/apiUrls";

export const tableContext = createContext(null);

function SaleContext({ children }) {
  const [tablesList, setTablesList] = useState(true);

  useEffect(() => {
    getData(GETALLTABLES).then((result) => {
      setTablesList(result.data.slice(2));
    });
  }, []);

  return (
    <tableContext.Provider value={{ tablesList }}>
      {children}
    </tableContext.Provider>
  );
}

export default SaleContext;
