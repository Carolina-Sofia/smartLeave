import { Month } from "@mantine/dates";
import { SimpleGrid, Paper, Title } from "@mantine/core";
import { HoverCard, Button, Text, Group } from "@mantine/core";

function YearCalendar({
  year,
  startDate,
  endDate,
  vacationDays = [],
  holidayDays = [],
  manuallySelectedDays,
  setManuallySelectedDays,
  maxManualDays,
}) {
  const months = Array.from(
    { length: 12 },
    (_, index) => new Date(year, index)
  );
  const formatDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

  const start = new Date(startDate);
  const end = new Date(endDate);

  return (
    <SimpleGrid
      spacing="sm"
      cols={4}
      breakpoints={[
        { maxWidth: "md", cols: 2 },
        { maxWidth: "sm", cols: 1 },
      ]}
    >
      {months.map((monthDate, index) => (
        <Paper
          key={index}
          p="xs"
          shadow="md"
          style={{
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <Title
            order={6}
            align="center"
            size="xs"
            style={{ marginBottom: "0.25rem" }}
          >
            {monthDate.toLocaleString("default", { month: "long" })}
          </Title>

          <Month
            month={monthDate}
            size="xs"
            getDayProps={(date) => {
              const dateStr = formatDate(date);
              const isSelected = manuallySelectedDays.includes(dateStr);
              const isVacation = vacationDays.includes(dateStr);
              const isHoliday = holidayDays.includes(dateStr);
              const isSat = date.getDay() === 6;
              const isSun = date.getDay() === 0;

              let backgroundColor = "";
              let color = "";
              let fontWeight = 400;

              if (date > end || date < start) {
                backgroundColor = "#e0e0e0"; // grey
                color = "#999";
                fontWeight = 400;
              } else if (isSelected) {
                backgroundColor = "#fce3f0"; // soft pink
                color = "#b3006b";
                fontWeight = 600;
              } else if (isVacation) {
                backgroundColor = "#ffc4e1"; // soft pink
                color = "#b3006b";
                fontWeight = 700;
              } else if (isHoliday) {
                backgroundColor = "#fff4b5"; // pastel yellow
                color = "#856404";
                fontWeight = 600;
              } else if (isSat || isSun) {
                backgroundColor = "#b0d4ff"; // soft blue
                color = "#004d99";
                fontWeight = 500;
              }

              const isAtLimit =
                manuallySelectedDays.length >= maxManualDays &&
                !manuallySelectedDays.includes(dateStr);

              return {
                style: {
                  backgroundColor,
                  color,
                  fontWeight,
                  borderRadius: "4px",
                  cursor: isAtLimit ? "not-allowed" : "pointer",
                },
                onClick: () => {
                  setManuallySelectedDays((prev) => {
                    if (prev.includes(dateStr)) {
                      // deselect
                      return prev.filter((d) => d !== dateStr);
                    } else if (prev.length < maxManualDays) {
                      // select only if limit not reached
                      return [...prev, dateStr];
                    } else {
                      return prev; // do nothing if at max
                    }
                  });
                },
              };
            }}
          />
        </Paper>
      ))}
    </SimpleGrid>
  );
}

export default YearCalendar;
