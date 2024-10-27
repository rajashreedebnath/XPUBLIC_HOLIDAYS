import { Holiday } from "../types/Holiday";

export const fetchCountries = async (): Promise<string[]> => {
  const response = await fetch(
    `https://holiday-tracker-backend.labs.crio.do/Countries`
  );
  if (!response.ok) {
    throw new Error("User not found");
  }
  const data = await response.json();
  return data;
};

export const fetchHolidays = async (country: string): Promise<Holiday[]> => {
  const response = await fetch(
    `https://holiday-tracker-backend.labs.crio.do/holidays?country=${country}`
  );
  if (!response.ok) {
    throw new Error("User not found");
  }
  const data = await response.json();
  return data;
};


