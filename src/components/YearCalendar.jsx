import { Month } from "@mantine/dates";
import { SimpleGrid, Paper, Title } from "@mantine/core";

function YearCalendar({
  year,
  startDate,
  endDate,
  vacationDays = [],
  holidayDays = [],
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
              const isSat = date.getDay() === 6;
              const isSun = date.getDay() === 0;

              /* out‑of‑range days */
              if (date < start || date > end) {
                return {
                  style: {
                    backgroundColor: "#e0e0e0",
                    color: "#999",
                    pointerEvents: "none",
                    opacity: 0.6,
                  },
                };
              }

              /* vacation‑recommendation days */
              if (vacationDays.includes(dateStr)) {
                return {
                  style: {
                    backgroundColor: "#ffc4e1", // soft pink
                    color: "#b3006b",
                    fontWeight: 700,
                    borderRadius: "4px",
                  },
                };
              }

              /* public holidays */
              if (holidayDays.includes(dateStr)) {
                return {
                  style: {
                    backgroundColor: "#fff4b5", // pastel yellow
                    color: "#856404",
                    fontWeight: 600,
                    borderRadius: "4px",
                  },
                };
              }

              /* weekends */
              if (isSat || isSun) {
                return {
                  style: {
                    backgroundColor: "#b0d4ff", // two blues
                    color: "#004d99",
                    fontWeight: 500,
                  },
                };
              }

              /* plain weekdays */
              return {};
            }}
          />
        </Paper>
      ))}
    </SimpleGrid>
  );
}

export default YearCalendar;
