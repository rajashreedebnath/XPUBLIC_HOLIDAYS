import React, { FC, useState, useEffect } from "react";
import "./HolidayForm.css";
import axios from "axios";

interface componentProp {
  onSearch: (country: string) => void;
}

const HolidayForm: FC<componentProp> = ({ onSearch }) => {
  const [countryName, setCountryName] = useState<string>("");
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSearch(countryName);
  };

  useEffect(() => {
    let fetchData = async () => {
      try {
        let response = await axios.get(
          "https://holiday-tracker-backend.labs.crio.do/countries"
        );

        if (response.data.length) {
          setCountries(response.data);
          setSelectedCountry(response.data[0]);
        } else {
          console.error("No data received from API");
        }
      } catch (error) {
        console.log("Error fetching countries", error);
      }
    };
    fetchData();
  }, []);

  console.log(countries);
  console.log(selectedCountry);
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        id="holiday-form"
        className="holiday_section"
      >
        <select
          value={selectedCountry}
          onChange={(event) => setCountryName(event.target.value)}
          id="country-select"
          className="dropdown"
        >
          {countries.map((country: string) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <button type="submit" className="fetchButton">
          Fetch Holidays
        </button>
      </form>
    </div>
  );
};

export default HolidayForm;
