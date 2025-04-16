import { Month } from "@mantine/dates";
import { SimpleGrid, Paper, Title } from "@mantine/core";
import { useState } from "react";

function YearCalendar({ year }) {
  const months = Array.from(
    { length: 12 },
    (_, index) => new Date(year, index)
  );

  return (
    <SimpleGrid
      spacing="sm"
      cols={4}
      breakpoints={[
        { maxWidth: "md", cols: 2 },
        { maxWidth: "sm", cols: 1 },
      ]}
      style={{ justifyContent: "center" }}
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
            classNames={{ day: "custom-day" }}
          />
        </Paper>
      ))}
    </SimpleGrid>
  );
}

export default YearCalendar;
