import { useState } from "react";
import "./App.css";
import data from "./assets/holiday.json";

function getWeekends() {
  const today = new Date();
  const end = new Date("2025-12-31");
  const saturdays = [];
  const sundays = [];

  // saturdays are 6, sundays are 0 - this is getting the first saturday
  while (today.getDay() !== 6) {
    today.setDate(today.getDate() + 1);
  }

  // jumping 7 to 7 days to collect the saturdays and sundays
  while (today <= end) {
    const saturday = new Date(today);
    const sunday = new Date(today);
    sunday.setDate(sunday.getDate() + 1);

    saturdays.push(saturday);
    sundays.push(sunday);
    today.setDate(today.getDate() + 7);
  }

  // console.log("Today", today);
  // console.log("Saturdays:", saturdays);
  // console.log("Sundays:", sundays);

  return;
}

function getHolidays() {
  const holidays = data.map((holiday) => holiday.date);
  let sumHolidays = holidays.length;

  // This substracts the weekends, so technicall we get 11 days off in portugal this year
  for (let i = 0; i < holidays.length; i++) {
    const holiday = new Date(holidays[i]);
    const holidayDay = holiday.getDay();
    if (holidayDay === 0) {
      sumHolidays -= 1;
    } else if (holidayDay === 6) {
      sumHolidays -= 1;
    }
  }
  console.log(holidays);
  console.log("Number of weekday holidays", sumHolidays);
}

function App() {
  getWeekends();
  getHolidays();
  return (
    <>
      <h1 className="pb-1">Smart Leave</h1>
      <p className="pb-5">We do the math. You book the flights.</p>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Number of vacation days"
          aria-label="Number of vacation days"
          aria-describedby="button-addon2"
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          id="button-addon2"
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default App;
