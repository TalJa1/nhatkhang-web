import { useState } from "react";
import { Box, Typography, IconButton, ButtonBase } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  getDate,
} from "date-fns";
import { vi } from "date-fns/locale";

const MiniCalendar = () => {
  const [currentMonth] = useState(new Date());
  const [selectedDate] = useState(new Date());
  const weekStart = startOfWeek(selectedDate, { locale: vi, weekStartsOn: 1 });
  const daysInWeek = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  return (
    <Box
      sx={{
        bgcolor: "#E3E7FE",
        borderRadius: "16px",
        padding: "16px",
        fontFamily: "sans-serif",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <IconButton size="small" disabled aria-label="previous month">
          <ChevronLeftIcon sx={{ color: "#1C1E30" }} />
        </IconButton>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: "#256A6A" }}
        >
          {format(currentMonth, "MMMM yyyy", { locale: vi })}
        </Typography>
        <IconButton size="small" aria-label="next month" disabled>
          <ChevronRightIcon sx={{ color: "#1C1E30" }} />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "8px",
        }}
      >
        {dayNames.map((dayName) => (
          <Typography
            key={dayName}
            variant="caption"
            sx={{
              color: "#8A8A8A",
              width: "32px",
              textAlign: "center",
              fontWeight: "medium",
            }}
          >
            {dayName}
          </Typography>
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-around" }}>
        {daysInWeek.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <ButtonBase
              key={day.toString()}
              sx={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: isSelected ? "bold" : "normal",
                color: isSelected ? "#FFFFFF" : "#1C1E30",
                bgcolor: isSelected ? "#256A6A" : "transparent",
                transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: isSelected ? "#1C1E30" : "#d0d4f7",
                },
              }}
              aria-label={format(day, "d MMMM yyyy", { locale: vi })}
              aria-pressed={isSelected}
              disabled
            >
              {getDate(day)}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
};

export default MiniCalendar;
