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
  const formatDate = (date) => date.toISOString().split("T")[0];
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

              if (vacationDays.includes(dateStr)) {
                return {
                  style: {
                    backgroundColor: "#ffcccc",
                    color: "#b30000",
                    fontWeight: 700,
                    borderRadius: "4px",
                  },
                };
              }

              if (holidayDays.includes(dateStr)) {
                return {
                  style: {
                    backgroundColor: "#fff3cd",
                    color: "#856404",
                    fontWeight: 600,
                    borderRadius: "4px",
                  },
                };
              }

              return {};
            }}
          />
        </Paper>
      ))}
    </SimpleGrid>
  );
}

export default YearCalendar;
