import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import { fetchHolidays } from "../api/holidayApi";
import "@testing-library/jest-dom";
import { Holiday } from "../types/Holiday";
import axios from "axios";

jest.mock("../api/holidayApi");

const mockHolidays = [
  { Date: "2022-01-01", "Holiday Name": "New Year's Day", Type: "Regional Holiday" }
];

describe("App basic functionalies", () => {
  it("renders the app and components", () => {
    render(<App />);
    expect(screen.getByText("Public Holiday Tracker")).toBeInTheDocument();
  });

  it("handles errors when fetching holidays", async () => {
    (fetchHolidays as jest.Mock).mockRejectedValue(new Error("Failed to fetch holidays"));

    render(<App />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "usa" } });
    const button = screen.getByRole("button", { name: /fetch holidays/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch holidays")).toBeInTheDocument();
    });
  });

  it("fetches and displays holidays successfully", async () => {
    (fetchHolidays as jest.Mock).mockResolvedValue(mockHolidays);

    render(<App />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "usa" } });
    const button = screen.getByRole("button", { name: /fetch holidays/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("New Year's Day")).toBeInTheDocument();
    });
  });
});
