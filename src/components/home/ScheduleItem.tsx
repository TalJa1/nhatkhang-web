// src/components/ScheduleItem.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School"; // Graduation cap icon
import type { ScheduleItemData } from "../../services/home/learningService";

interface ScheduleItemProps {
  item: ScheduleItemData;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ item }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
      {" "}
      {/* Gap between icon and text, margin bottom */}
      <SchoolIcon sx={{ color: "#333" }} /> {/* Icon color */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "medium", lineHeight: 1.3 }}
        >
          {item.title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {" "}
          {/* Use gap for spacing */}
          <Typography variant="body2" color="text.secondary">
            {item.subject}
          </Typography>
          <Typography
            variant="body2"
            color="#FF6B6B"
            sx={{ fontWeight: "medium" }}
          >
            {" "}
            {/* Reddish Date */}| {item.date}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            | {item.time}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ScheduleItem;
