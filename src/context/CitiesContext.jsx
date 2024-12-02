/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer, useState } from "react";

const CitiesContext = createContext();

const URL = `http://localhost:8000`;

const initState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };
    case "city/loaded":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "city/created":
      return { ...state, cities: [...state.cities, action.payload], isLoading: false };
    case "city/deleted": {
      const updatedCities = state.cities.filter((city) => city.id !== action.payload);
      return { ...state, cities: [...updatedCities], isLoading: false };
    }
    case "loading":
      return { ...state, isLoading: true };
    case "rejected":
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error("unknown action!");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, currentCity, isLoading }, dispatch] = useReducer(reducer, initState);
  // const [cities, setCities] = useState([]);
  // const [currentCity, setCurrentCity] = useState({});
  // const [isLoading, setIsLoading] = useState(false);

  console.log("cities: ", cities);
  console.log("currentCity: ", currentCity);

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });

        const res = await fetch(`${URL}/cities`);
        const data = await res.json();
        // setCities(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        console.log("error: ", error);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      dispatch({ type: "loading" });

      const res = await fetch(`${URL}/cities/${id}`);
      const data = await res.json();
      // setCurrentCity((city) => (city = data));
      dispatch({ type: "city/loaded", payload: data });
    } catch (error) {
      console.log("error: ", error);
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });

      const res = await fetch(`${URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // setCities((cities) => [...cities, newCity]);
      dispatch({ type: "city/created", payload: newCity });
    } catch (error) {
      console.log("error: ", error);
    }
  }

  async function deleteCity(id) {
    console.log("Deleting...");
    try {
      dispatch({ type: "loading" });

      const res = await fetch(`${URL}/cities/${id}`, {
        method: "DELETE",
      });

      // setCities((cities) => cities.filter((city) => city.id !== id));
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      console.log("error: ", error);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
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
