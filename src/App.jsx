import { useState } from "react";
import "./App.css";
import data from "./assets/holiday.json";

// Gives an array of saturdays and sundays from today to a specific date
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

  return [saturdays, sundays];
}

// Gets holidays from holiday.json and tells how many are on weekdays
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

  console.log("Number of weekday holidays", sumHolidays);

  return holidays;
}

function App() {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  function handleCalculate() {
    const [saturdays, sundays] = getWeekends();
    const holidaysRaw = getHolidays();
    const vacationDays = parseInt(inputValue);

    const formatDate = (date) => date.toISOString().split("T")[0];

    const holidaySet = new Set(holidaysRaw.map((d) => formatDate(new Date(d))));
    const saturdaySet = new Set(saturdays.map(formatDate));
    const sundaySet = new Set(sundays.map(formatDate));

    let today = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const end = new Date("2025-12-31");
    let daysLeft = vacationDays;
    let bestDays = [];

    while (today <= end && daysLeft > 0) {
      const currentStr = formatDate(today);

      const prevDay = new Date(today.getTime() - oneDayMs);
      const nextDay = new Date(today.getTime() + oneDayMs);
      const prevStr = formatDate(prevDay);
      const nextStr = formatDate(nextDay);

      const isBridgeDay =
        // sexta no meio de feriado e fim de semana
        ((today.getDay() === 5 && holidaySet.has(prevStr)) ||
          // segunda no meio de feriado e fim de semana
          (today.getDay() === 1 && holidaySet.has(nextStr))) &&
        !holidaySet.has(currentStr) &&
        !saturdaySet.has(currentStr) &&
        !sundaySet.has(currentStr);

      if (isBridgeDay) {
        bestDays.push(currentStr);
        daysLeft--;
      }

      // próximo dia
      today.setDate(today.getDate() + 1);
    }

    console.log("Recommended vacation days:", bestDays);
  }

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
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          className="btn btn-outline-secondary"
          type="submit"
          id="button-addon2"
          onClick={handleCalculate}
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default App;
