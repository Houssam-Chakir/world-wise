/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();

const URL = `http://localhost:8000`;

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [currentCity, setCurrentCity] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);

        const res = await fetch(`${URL}/cities`);
        const data = await res.json();
        setCities(data);

        console.log("data: ", data);
      } catch (error) {
        console.log("error: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
      try {
        setIsLoading(true);

        const res = await fetch(`${URL}/cities/${id}`);
        const data = await res.json();
        setCurrentCity((city) => (city = data));

        console.log("data: ", data);
      } catch (error) {
        console.log("error: ", error);
      } finally {
        setIsLoading(false);
      }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) throw new Error("useCities is being used outside the scope of its provider");
  return context;
}

export { CitiesProvider, useCities };
