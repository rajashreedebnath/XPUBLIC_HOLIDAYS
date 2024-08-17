import React from "react";
import { render, screen } from "@testing-library/react";
import HolidayList from "../components/HolidayList";
import { Holiday } from "../types/Holiday";
import "@testing-library/jest-dom";

describe("HolidayList", () => {
    const mockHolidays: Holiday[] = [
        {
          Date: "2022-01-01",
          "Holiday Name": "New Year's Day",
          Type: "Regional Holiday",
          Country: "India", // Added missing property
          "Country Code": "IN", // Added missing property
          Day: "Saturday", // Added missing property
          Comments: "", // Added missing property
        },
        {
          Date: "2022-01-02",
          "Holiday Name": "Mannam Jayanthi",
          Type: "Regional Holiday",
          Country: "India", // Added missing property
          "Country Code": "IN", // Added missing property
          Day: "Sunday", // Added missing property
          Comments: "", // Added missing property
        },
      ];

    it("displays a list of holidays", () => {
        render(<HolidayList holidays={mockHolidays} />);
    
        mockHolidays.forEach(holiday => {
          expect(screen.getByText(holiday["Holiday Name"])).toBeInTheDocument();
          expect(
            screen.getByText(
              new Date(holiday.Date).toLocaleDateString(undefined, {
                day: "numeric",
                month: "long",
              })
            )
          ).toBeInTheDocument();
    
          // Ensure there is an exact number of "Regional Holiday" matches
          expect(screen.getAllByText(holiday.Type).length).toBe(
            mockHolidays.filter(h => h.Type === holiday.Type).length
          );
        });
      });
});
