import React, { useState } from "react";
import { fetchHolidays } from "./api/holidayApi";
import HolidayForm from "./components/HolidayForm";
import HolidayList from "./components/HolidayList";
import "./index.css"
import { Holiday } from "./types/Holiday";

const App: React.FC = () => {
  const [country, setCountry] = useState<Holiday[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleHolidayFetcher = async (selectedCountry: string) => {
    try {
      setError(null);
      const countryData = await fetchHolidays(selectedCountry);
      setCountry(countryData.length ? countryData : null);
    } catch (error) {
      setError("Failed to fetch holidays");
      setCountry(null);
    }
  };

  return (
    <div className="App">
      <h1>Public Holiday Tracker</h1>
      <HolidayForm onSearch={handleHolidayFetcher} />
      {error && <p className="error">{error}</p>}
      {country && <HolidayList holidays={country} />}
    </div>
  );
};

export default App;
