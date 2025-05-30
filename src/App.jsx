import { useState } from "react";
import "./App.css";
import data from "./assets/holiday.json";
import YearCalendar from "./components/YearCalendar";

// Gives an array of saturdays and sundays from today to a specific date
function getWeekends(startDate, endDate) {
  const today = new Date(startDate);
  const end = new Date(endDate);
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

// Format the date
function parseDateString(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
}

// Gets holidays from holiday.json that are within the date range
function getHolidays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return data
    .map((holiday) => parseDateString(holiday.date))
    .filter((date) => date >= start && date <= end);
}

// Sums the total of free days in the range = weekends + holidays
function getFreeDays(startDate, endDate) {
  const today = new Date(startDate);
  const end = new Date(endDate);
  const holidays = getHolidays(startDate, endDate);
  const [saturdays, sundays] = getWeekends(startDate, endDate);

  // Calcular número de dias feriados de semana
  let sumWeekdayHolidays = holidays.length;

  // This substracts the weekends so we get weekday holidays
  for (let i = 0; i < holidays.length; i++) {
    const holiday = new Date(holidays[i]);
    const holidayDay = holiday.getDay();
    if (holidayDay === 0) {
      sumWeekdayHolidays -= 1;
    } else if (holidayDay === 6) {
      sumWeekdayHolidays -= 1;
    }
  }

  console.log(holidays);
  console.log("Number of weekday holidays", sumHolidays);
}

function App() {
  const formatDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

  const [inputValue, setInputValue] = useState("");
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(
    formatDate(new Date(new Date().getFullYear(), 11, 31))
  );

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handlePrevYear = () => setCurrentYear((prev) => prev - 1);
  const handleNextYear = () => setCurrentYear((prev) => prev + 1);

  const handleInputChange = (event) => {
    let value = parseInt(event.target.value, 10);

    if (isNaN(value)) {
      setInputValue("");
      return;
    }

    if (value < 1) value = 1;
    if (value > 365) value = 365;

    setInputValue(value.toString());
  };

  const handleDateStartChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleDateEndChange = (event) => {
    setEndDate(event.target.value);
  };

  const [vacationRecs, setVacationRecs] = useState([]);

  //I use useState so that react can track if this is changed and render this
  // This needs to be declared outside of functions
  const [restDays, setRestDays] = useState(0);

  function handleCalculate() {
    const [saturdays, sundays] = getWeekends(startDate, endDate);
    const holidaysRaw = getHolidays(startDate, endDate);
    const vacationDays = parseInt(inputValue);

    const holidaySet = new Set(holidaysRaw.map(formatDate));
    const saturdaySet = new Set(saturdays.map(formatDate));
    const sundaySet = new Set(sundays.map(formatDate));

    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    const oneDayMs = 24 * 60 * 60 * 1000;
    let daysLeft = vacationDays;
    let bestDays = [];

    while (currentDate <= end && daysLeft > 0) {
      const currentStr = formatDate(currentDate);

      const prevDay = new Date(currentDate.getTime() - oneDayMs);
      const nextDay = new Date(currentDate.getTime() + oneDayMs);
      const prevStr = formatDate(prevDay);
      const nextStr = formatDate(nextDay);

      const isBridgeDay =
        // sexta no meio de feriado e fim de semana
        ((currentDate.getDay() === 5 && holidaySet.has(prevStr)) ||
          // segunda no meio de feriado e fim de semana
          (currentDate.getDay() === 1 && holidaySet.has(nextStr))) &&
        !holidaySet.has(currentStr) &&
        !saturdaySet.has(currentStr) &&
        !sundaySet.has(currentStr);

      if (isBridgeDay) {
        bestDays.push(currentStr);
        daysLeft--;
      }

      // próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setVacationRecs(bestDays);
    console.log("Recommended vacation days:", bestDays);
  }

  const formattedVacationDays = vacationRecs;

  const formattedHolidayDays = getHolidays(startDate, endDate).map((d) =>
    formatDate(d)
  );

  const [selectedCountry, setSelectedCountry] = useState("");
  const [manuallySelectedDays, setManuallySelectedDays] = useState([]);

  return (
    <>
      <div className="page pt-4 px-5">
        {/* Left side */}
        <div className="form col-3 pt-3">
          <h1 className="pb-1">Smart Leave</h1>
          <p className="pb-5">We do the math. You book the flights.</p>
          {/* Dar para selecionar o país - neste momento só tem feriados de portugal */}
          {/* <div className="input-group mb-3">
            <select
              className="form-select"
              aria-label="Country select"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Select Country</option>
              <option value="portugal">Portugal</option>
            </select>
          </div> */}
          {/* Start date */}
          <div className="input-group mb-3">
            <span className="input-group-text">From:</span>
            <input
              type="date"
              className="form-control"
              placeholder="16/04/2025"
              aria-label="Start date"
              aria-describedby="button-addon2"
              onChange={handleDateStartChange}
              value={startDate}
            />
          </div>
          {/* End date */}
          <div className="input-group mb-3">
            <span className="input-group-text">To:</span>
            <input
              type="date"
              className="form-control"
              placeholder="Number of vacation days"
              aria-label="Start date"
              aria-describedby="button-addon2"
              onChange={handleDateEndChange}
              value={endDate}
            />
          </div>
          {/* Number of vacation days */}
          <p>Number of vacations days:</p>
          <div className="input-group mb-3">
            <input
              type="number"
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
          <p>Current rest days: {restDays}</p>

          {inputValue && (
            <p>
              Days left to select manually:{" "}
              {parseInt(inputValue) - manuallySelectedDays.length}
            </p>
          )}

          <div className="legend pt-3">
            <div className="legend-square">
              <span
                className="color-legend"
                style={{ background: "#ffc4e1" }}
              ></span>
              Recommended Vacation Pick
            </div>
            <div className="legend-square">
              <span
                className="color-legend"
                style={{ background: "#fce3f0" }}
              ></span>
              Self-selected Vacation Pick
            </div>
            <div className="legend-square">
              <span
                className="color-legend"
                style={{ background: "#fff4b5" }}
              ></span>
              Public holiday
            </div>
            <div className="legend-square">
              <span
                className="color-legend"
                style={{ background: "#b0d4ff" }}
              ></span>
              Weekends
            </div>
            <div className="legend-square">
              <span
                className="color-legend"
                style={{ background: "#e0e0e0" }}
              ></span>
              Out of range
            </div>
          </div>
        </div>

        {/* Right side */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <button
              onClick={handlePrevYear}
              className="btn btn-outline-secondary"
            >
              ←
            </button>
            <h2 className="m-0 fs-3">{currentYear}</h2>
            <button
              onClick={handleNextYear}
              className="btn btn-outline-secondary"
            >
              →
            </button>
          </div>

          <YearCalendar
            year={currentYear}
            startDate={startDate}
            endDate={endDate}
            vacationDays={formattedVacationDays}
            holidayDays={formattedHolidayDays}
            manuallySelectedDays={manuallySelectedDays}
            setManuallySelectedDays={setManuallySelectedDays}
            maxManualDays={parseInt(inputValue) || 0}
          />
        </div>
      </div>
    </>
  );
}

export default App;
