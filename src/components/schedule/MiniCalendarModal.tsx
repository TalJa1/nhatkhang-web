// src/components/MiniCalendarModal.tsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  ButtonBase,
  useTheme,
  alpha,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  getDate,
} from "date-fns";
import { vi } from "date-fns/locale";

interface MiniCalendarModalProps {
  initialDate: Date; // The date that was originally clicked to open the modal
  selectedDate: Date | null; // The currently selected date (should be same as initialDate)
  onClose: () => void; // Function to close the parent modal
}

const MiniCalendarModal: React.FC<MiniCalendarModalProps> = ({
  initialDate,
  selectedDate,
  onClose,
}) => {
  const theme = useTheme();
  // Keep track of the month displayed *within this mini calendar*
  const [modalCurrentMonth, setModalCurrentMonth] = useState(
    startOfMonth(initialDate)
  );

  // Calculate the days to display in the grid for the modal's current month
  const modalDaysInGrid = useMemo(() => {
    const monthStart = startOfMonth(modalCurrentMonth);
    const monthEnd = endOfMonth(modalCurrentMonth);
    // Ensure week starts on Monday (T2)
    const startDate = startOfWeek(monthStart, { locale: vi, weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { locale: vi, weekStartsOn: 1 });
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [modalCurrentMonth]);

  // Handlers for mini calendar navigation
  const handlePrevModalMonth = () =>
    setModalCurrentMonth(subMonths(modalCurrentMonth, 1));
  const handleNextModalMonth = () =>
    setModalCurrentMonth(addMonths(modalCurrentMonth, 1));

  // Day labels (Monday first)
  const dayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 2,
        backgroundColor: "#f8f9fa",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          mb: 2,
          textAlign: "center",
          color: theme.palette.text.primary,
        }}
      >
        Chọn ngày
      </Typography>

      {/* Month Navigation Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <IconButton
          onClick={handlePrevModalMonth}
          size="small"
          aria-label="previous month"
        >
          <ChevronLeftIcon />
        </IconButton>
        <Typography
          variant="body1"
          sx={{ fontWeight: "medium", color: theme.palette.text.primary }}
        >
          {format(modalCurrentMonth, "MMMM yyyy", { locale: vi })}
        </Typography>
        {/* Styled Right Arrow Button */}
        <IconButton
          onClick={handleNextModalMonth}
          size="small"
          aria-label="next month"
          sx={{
            backgroundColor: alpha(theme.palette.primary.light, 0.15), // Slightly adjusted alpha
            color: theme.palette.primary.dark, // Darker icon color
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.light, 0.25),
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Day Names Row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          mb: 1.5,
        }}
      >
        {dayLabels.map((label) => (
          <Typography
            key={label}
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      {/* Days Grid */}
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}
      >
        {modalDaysInGrid.map((day) => {
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonthVal = isSameMonth(day, modalCurrentMonth);

          // Determine background color based on selection and month
          const bgColor = isSelected
            ? "#D32F2F" // Main selected (dark red)
            : // Slightly lighter red for other days in the *selected* month
            // Only apply this if the day belongs to the month being viewed *and* that month is the *same* as the initially selected date's month
            isCurrentMonthVal && isSameMonth(day, initialDate)
            ? alpha("#D32F2F", 0.15)
            : "transparent"; // Days outside month or in non-selected months

          // Determine text color
          const textColor = isSelected
            ? "#fff" // White text for selected
            : isCurrentMonthVal
            ? theme.palette.text.primary // Default text for current month
            : theme.palette.text.disabled; // Disabled text for other months

          return (
            <ButtonBase
              key={day.toString()}
              disabled // Make it non-interactive
              focusRipple={false} // Disable ripple effect
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
                opacity: 1, // Ensure full opacity
                transition: "background-color 0.1s ease-in-out",
                cursor: "default", // Indicate non-interactive
              }}
            >
              {getDate(day)}
            </ButtonBase>
          );
        })}
      </Box>

      {/* Close Button at the bottom */}
      <Button
        variant="outlined"
        fullWidth
        onClick={onClose}
        sx={{
          mt: "auto", // Push to bottom
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
          fontWeight: "medium",
          borderRadius: "8px",
          textTransform: "none", // Prevent uppercase text
        }}
      >
        Đóng lịch
      </Button>
    </Box>
  );
};

export default MiniCalendarModal;
