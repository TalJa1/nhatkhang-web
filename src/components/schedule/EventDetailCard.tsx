// src/components/EventDetailCard.tsx
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Using clock icon
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined"; // Bell icon
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Options icon
import { format } from "date-fns";
import type { CalendarEvent, EventCategory } from "../../services/calendar/calendarData";

interface EventDetailCardProps {
  event: CalendarEvent;
}

// Reusable color helper (ensure this matches the one used elsewhere or import it)
const getEventColor = (
  category: EventCategory
): { background: string; text: string; border: string } => {
  switch (category) {
    case "Lịch học":
      return { background: "#E0F2E9", text: "#4CAF50", border: "#A5D6A7" };
    case "Kiểm tra":
      return { background: "#FFEBEE", text: "#D32F2F", border: "#EF9A9A" };
    case "Kỳ thi":
      return { background: "#E3F2FD", text: "#1976D2", border: "#90CAF9" };
    case "Sự kiện":
      return { background: "#FFF3E0", text: "#EF6C00", border: "#FFCC80" };
    default:
      return { background: "#F5F5F5", text: "#616161", border: "#E0E0E0" };
  }
};

const EventDetailCard: React.FC<EventDetailCardProps> = ({ event }) => {
  const theme = useTheme();
  const colors = getEventColor(event.category);

  // Determine border color based on category for the whole card
  const cardBorderColor =
    event.category === "Kiểm tra"
      ? colors.text // Red border for Kiểm tra
      : event.category === "Kỳ thi"
      ? colors.text // Blue border for Kỳ thi
      : theme.palette.divider; // Default border otherwise

  return (
    <Paper
      variant="outlined"
      sx={{
        mb: 2, // Margin bottom between cards
        p: 1.5, // Padding inside the card
        borderRadius: "12px", // Rounded corners
        borderColor: cardBorderColor, // Apply dynamic border color
        borderWidth: "1px",
      }}
    >
      {/* Top Row: Chips and Icons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        {/* Category Chip(s) */}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {/* Main Category Chip */}
          <Chip
            label={event.category}
            size="small"
            sx={{
              // Use slightly transparent border color for background
              backgroundColor: alpha(cardBorderColor, 0.1),
              // Use border color for text
              color: cardBorderColor,
              fontWeight: "medium",
              borderRadius: "6px",
              // Use subtle border matching text color but more transparent
              border: `1px solid ${alpha(cardBorderColor, 0.3)}`,
              height: "auto", // Adjust height automatically
              "& .MuiChip-label": {
                padding: "2px 6px", // Adjust chip padding
              },
            }}
          />
          {/* Example: Add another chip if needed based on data */}
          {/* {event.subject && <Chip label={event.subject} size="small" variant="outlined" />} */}
        </Box>
        {/* Action Icons */}
        <Box>
          <IconButton
            size="small"
            sx={{ color: theme.palette.primary.main, mr: 0.5 }}
            aria-label="notification"
          >
            {/* You might want to add a Badge here if there's a notification status */}
            <NotificationsNoneOutlinedIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: theme.palette.text.secondary }}
            aria-label="options"
          >
            <MoreVertIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>

      {/* Event Title */}
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", mb: 0.5, color: theme.palette.text.primary }}
      >
        {event.title}
      </Typography>

      {/* Event Description */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {" "}
        {/* Increased margin */}
        {/* Use a default text if description is missing, as shown in image */}
        Ghi chú:{" "}
        {event.description ||
          "Nội dung ôn tập, hoặc nội dung ghi chú cho sự kiện."}
      </Typography>

      {/* Time Information */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <AccessTimeIcon
          fontSize="inherit"
          sx={{ color: "text.secondary", verticalAlign: "middle" }}
        />
        <Typography variant="body2" color="text.secondary">
          {/* Display time range or 'All day' */}
          {event.allDay
            ? "Cả ngày"
            : `${format(event.start, "HH:mm")} ${
                event.end ? `- ${format(event.end, "HH:mm")}` : ""
              }`}
        </Typography>
      </Box>
    </Paper>
  );
};

export default EventDetailCard;
