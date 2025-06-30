import { useState } from "react";
import { Box, Typography, IconButton, ButtonBase } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  getDate, // Gets the day of the month (1-31)
} from "date-fns";
import { vi } from "date-fns/locale"; // Import Vietnamese locale

const MiniCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // State for the *specific day* selected by the user
  const [selectedDate, setSelectedDate] = useState(new Date());

  // --- Date Calculations ---
  // Determine the start of the week for the *selected* date
  // weekStartsOn: 1 makes Monday the first day (T2)
  const weekStart = startOfWeek(selectedDate, { locale: vi, weekStartsOn: 1 });

  // Generate the 7 days of the currently selected week
  const daysInWeek = Array.from({ length: 7 }).map((_, i) =>
    addDays(weekStart, i)
  );

  // --- Handlers ---
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    // Optional: Also move the selected date to the previous month?
    // setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    // Optional: Also move the selected date to the next month?
    // setSelectedDate(addMonths(selectedDate, 1));
  };

  const handleDateSelect = (day: Date) => {
    setSelectedDate(day);
    // Also update the viewed month if the selected date falls into a different month
    if (!isSameMonth(day, currentMonth)) {
      setCurrentMonth(day);
    }
  };

  // --- Constants for Display ---
  const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]; // Monday to Sunday

  return (
    <Box
      sx={{
        bgcolor: "#E3E7FE", // Light purple background
        borderRadius: "16px", // Rounded corners
        padding: "16px",
        fontFamily: "sans-serif", // Basic font
      }}
    >
      {/* Header: Arrows and Month/Year */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <IconButton
          onClick={handlePrevMonth}
          size="small"
          disabled
          aria-label="previous month"
        >
          <ChevronLeftIcon sx={{ color: "#1C1E30" }} />
        </IconButton>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: "#256A6A" }}
        >
          {/* Format Month Year using Vietnamese locale */}
          {format(currentMonth, "MMMM yyyy", { locale: vi })}
        </Typography>
        <IconButton
          onClick={handleNextMonth}
          size="small"
          aria-label="next month"
          disabled
        >
          <ChevronRightIcon sx={{ color: "#1C1E30" }} />
        </IconButton>
      </Box>

      {/* Day Names Row */}
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
              color: "#8A8A8A", // Greyish color for day names
              width: "32px", // Ensure alignment with dates below
              textAlign: "center",
              fontWeight: "medium",
            }}
          >
            {dayName}
          </Typography>
        ))}
      </Box>

      {/* Dates Row */}
      <Box sx={{ display: "flex", justifyContent: "space-around" }}>
        {daysInWeek.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          // const isCurrentMonth = isSameMonth(day, currentMonth); // Optional: dim days not in current month

          return (
            <ButtonBase
              key={day.toString()}
              onClick={() => handleDateSelect(day)}
              sx={{
                width: "32px",
                height: "32px",
                borderRadius: "50%", // Circular shape
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: isSelected ? "bold" : "normal",
                color: isSelected ? "#FFFFFF" : "#1C1E30", // White text if selected, dark otherwise
                bgcolor: isSelected ? "#256A6A" : "transparent", // Dark background if selected
                // opacity: isCurrentMonth ? 1 : 0.6, // Example: Dim days from other months
                transition:
                  "background-color 0.2s ease-in-out, color 0.2s ease-in-out", // Smooth transition
                "&:hover": {
                  bgcolor: isSelected ? "#1C1E30" : "#d0d4f7", // Slightly darker hover or keep selected color
                },
              }}
              aria-label={`Select date ${format(day, "d MMMM yyyy", {
                locale: vi,
              })}`}
              aria-pressed={isSelected}
            >
              {/* Get the day number (e.g., 27) */}
              {getDate(day)}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
};

export default MiniCalendar;
