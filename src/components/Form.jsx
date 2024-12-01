// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../context/CitiesContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const { createCity, isLoading } = useCities();

  const navigateTo = useNavigate()

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat, lng] = useUrlPosition();
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState("");

  useEffect(
    function () {
      if (!lat && !lng) return;
      console.log("reverse geocoding");
      async function fetchCityData() {
        try {
          setIsLoadingGeo(true);
          setGeocodingError("");
          const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
          const data = await res.json();

          if (!data.countryCode) throw new Error("That doesn't seem to be a valid city/country.");

          setCityName(data.city || data.locality || "Unknown");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (error) {
          console.log("error: ", error);
          setGeocodingError(error.message);
        } finally {
          setIsLoadingGeo(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await createCity(newCity);
    navigateTo('/app/cities')
  }

  if (!lat && !lng) return <Message message='Start by clicking somewhere in the map' />;
  if (isLoadingGeo) return <Spinner />;
  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form className={`${styles.form} ${isLoading? styles.loading : ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input id='cityName' onChange={(e) => setCityName(e.target.value)} value={cityName} />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>
        {/* <input id='date' onChange={(e) => setDate(e.target.value)} value={date} /> */}
        <DatePicker id='date' onChange={(date) => setDate(date)} selected={date} />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea id='notes' onChange={(e) => setNotes(e.target.value)} value={notes} />
      </div>

      <div className={styles.buttons}>
        <Button type={"primary"}>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
