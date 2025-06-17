import React, { useState, useMemo } from "react";
import {
  Box,
  ButtonBase,
  IconButton,
  useTheme,
  alpha,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  getDate,
  addMonths,
  subMonths,
} from "date-fns";
import { vi } from "date-fns/locale";

interface LeftCalendarProps {
  selectedDate: Date | null; // The currently selected date
  onDateChange: (date: Date) => void; // Callback to update the selected date
}

const LeftCalendar: React.FC<LeftCalendarProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const daysInGrid = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { locale: vi, weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { locale: vi, weekStartsOn: 1 });
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const handleDayClick = (day: Date) => {
    onDateChange(day);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        backgroundColor: "#f8f9fa",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <IconButton onClick={handlePrevMonth}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="bold">
          {currentMonth.toLocaleString("vi-VN", { month: "long", year: "numeric" })}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}
      >
        {daysInGrid.map((day) => {
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonthVal = isSameMonth(day, currentMonth);

          const bgColor = isSelected
            ? "#D32F2F"
            : isCurrentMonthVal
            ? alpha("#D32F2F", 0.15)
            : "transparent";

          const textColor = isSelected
            ? "#fff"
            : isCurrentMonthVal
            ? theme.palette.text.primary
            : theme.palette.text.disabled;

          return (
            <ButtonBase
              key={day.toString()}
              onClick={() => handleDayClick(day)}
              sx={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                color: textColor,
                bgcolor: bgColor,
                fontWeight: isSelected ? "bold" : "normal",
                opacity: 1,
                transition: "background-color 0.1s ease-in-out",
                cursor: "pointer",
              }}
            >
              {getDate(day)}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
};

export default LeftCalendar;
