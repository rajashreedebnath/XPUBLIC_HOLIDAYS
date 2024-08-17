import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import HolidayForm from "../components/HolidayForm";
import "@testing-library/jest-dom";

jest.mock("axios");

const mockCountries = ["usa","canada","india"];

describe("HolidayForm", () => {
  it("renders the form and button", () => {
    render(<HolidayForm onSearch={jest.fn()} />);
    const button = screen.getByRole("button", { name: /fetch holidays/i });
    expect(button).toBeInTheDocument();
  });

  it("fetches countries and displays them in the dropdown", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockCountries });

    render(<HolidayForm onSearch={jest.fn()} />);
    
    await waitFor(() => screen.getByRole("combobox"));

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select.children).toHaveLength(mockCountries.length); // +1 for the default option, removed for now bcz no default in our drop-down
  });

  it("calls onSearch with the selected country on form submit", async () => {
    const onSearchMock = jest.fn();
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockCountries });

    render(<HolidayForm onSearch={onSearchMock} />);

    // Wait for the countries to be loaded and the select element to be populated
    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());

    const select = screen.getByRole("combobox") as HTMLSelectElement;

    fireEvent.change(select, { target: { value: "usa" } });

    // Ensure the state has been updated before submitting the form
    expect(select.value).toBe("usa");

    const button = screen.getByRole("button", { name: /fetch holidays/i });
    fireEvent.click(button);

    // Wait for a fixed time after submitting the form
    await new Promise((resolve) => setTimeout(resolve, 4000)); // 4 second wait

    await waitFor(() => expect(onSearchMock).toHaveBeenCalledWith("usa"));
  });
  
});
