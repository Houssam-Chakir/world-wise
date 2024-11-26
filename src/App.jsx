import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import Product from "./pages/Product";
import Homepage from "./pages/Homepage";
import Pricing from "./pages/pricing";
import NotFound from "./pages/NotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";

const URL = `http://localhost:8000`;
function App() {
  const [cities, setCities] = useState([]);
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

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path='app' element={<AppLayout />}>
          <Route index element={<CityList cities={cities} isLoading={isLoading} />} />
          <Route path='cities' element={<CityList cities={cities} isLoading={isLoading} />} />
          <Route path='countries' element={<CountryList cities={cities} isLoading={isLoading} />} />
          <Route path='form' element={<p>form</p>} />
        </Route>
        <Route path='login' element={<Login />} />
        <Route path='product' element={<Product />} />
        <Route path='pricing' element={<Pricing />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
