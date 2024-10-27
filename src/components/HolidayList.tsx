import React from "react";
import { Holiday } from "../types/Holiday";
import "./HolidayList.css"

interface HolidayProps {
  holidays: Holiday[];
}

const HolidayList: React.FC<HolidayProps> = ({ holidays }) => {
  return (
    <div>
      {holidays.map((holiday: Holiday) => (
        <div className="holiday-card" key={holiday["Holiday Name"]}>
          <h3>{holiday["Holiday Name"]}</h3>
          <p>
            {new Date(holiday.Date).toLocaleDateString(undefined, {
              day: "numeric",
              month: "long",
            })}
          </p>
          <p className="bottom-p">{holiday["Type"]}</p>
        </div>
      ))}
    </div>
  );
};

export default HolidayList;
