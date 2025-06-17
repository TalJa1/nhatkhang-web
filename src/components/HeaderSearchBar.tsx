import React, { useState, useEffect } from "react";
import {
  Box,
  InputBase,
  Avatar,
  Typography,
  IconButton,
  Badge, // For the notification dot
  Paper, // Use Paper for subtle elevation/background
  alpha, // Utility for color transparency
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

// --- Placeholder - Replace with your actual image path ---
import userAvatarPlaceholder from "../assets/home/avatar.png"; // Create or replace this image

// --- Component Props Interface ---
interface HeaderBarProps {
  userName: string;
  avatarSrc?: string; // Optional: Allow passing avatar source
  notificationCount?: number; // Optional: Show a badge count
}

// Define the structure of the user data in local storage
interface UserData {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

const HeaderSearchBar: React.FC<HeaderBarProps> = ({
  userName,
  avatarSrc = userAvatarPlaceholder, // Default to placeholder
  notificationCount = 1, // Example: show 1 notification dot by default
}) => {
  const theme = useTheme(); // Access theme for consistent styling
  const [displayAvatarSrc, setDisplayAvatarSrc] = useState(avatarSrc);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const userData: UserData = JSON.parse(storedUserData);
        if (userData && userData.photoURL) {
          setDisplayAvatarSrc(userData.photoURL);
        }
      } catch (error) {
        console.error("Failed to parse user data from local storage:", error);
        // Keep the default avatar if parsing fails
      }
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <Paper
      elevation={0} // No shadow needed based on image, but Paper provides background
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // Space out search and right-side items
        padding: theme.spacing(1, 2), // Vertical padding 1 unit, horizontal 2 units
        borderRadius: "12px", // Soft overall rounding if needed (often applied by parent)
        // backgroundColor: theme.palette.background.paper, // Use theme background
      }}
    >
      {/* Search Input Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: alpha(theme.palette.common.black, 0.04), // Very light grey background
          borderRadius: "12px", // Rounded corners for search
          padding: theme.spacing(0.5, 1.5), // Padding inside the search box
          flexGrow: 1, // Allow search to take available space
          // maxWidth: "500px", // Optional: Limit max width of search
          mr: 2, // Margin to separate from right items
        }}
      >
        <SearchIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
        <InputBase
          placeholder="Tìm kiếm…" // Search placeholder
          fullWidth
          sx={{
            fontSize: "0.95rem",
            color: theme.palette.text.primary,
            "& .MuiInputBase-input::placeholder": {
              color: theme.palette.text.secondary,
              opacity: 1,
            },
          }}
          inputProps={{ "aria-label": "search" }}
        />
      </Box>

      {/* Right Side Items Section */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: theme.spacing(1.5) }}
      >
        {/* User Profile Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer", // Indicate it's clickable (for dropdown menu)
            gap: theme.spacing(1),
            padding: theme.spacing(0.5, 1), // Padding around user info
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: alpha(theme.palette.action.active, 0.04), // Subtle hover
            },
          }}
        >
          <Avatar
            alt={userName}
            src={displayAvatarSrc} // Use state variable here
            sx={{ width: 32, height: 32 }} // Adjust size as needed
          />
          <Typography
            variant="body2"
            sx={{ fontWeight: "medium", color: theme.palette.text.primary }}
          >
            {userName}
          </Typography>
          <ArrowDropDownIcon sx={{ color: theme.palette.text.secondary }} />
        </Box>

        {/* Notification Bell Section */}
        <IconButton
          size="medium"
          aria-label="show new notifications"
          color="inherit"
          sx={{
            border: `1px solid ${theme.palette.divider}`, // Border around icon button
            borderRadius: "10px", // Rounded square shape
            padding: theme.spacing(0.75), // Adjust padding for size
            color: theme.palette.text.secondary, // Icon color
          }}
        >
          <Badge
            badgeContent={notificationCount}
            color="error" // Red dot color
            variant="dot" // Use a dot instead of a number count
            overlap="circular" // Position dot correctly
            invisible={!notificationCount || notificationCount === 0} // Hide dot if count is 0
          >
            <NotificationsNoneOutlinedIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Box>
    </Paper>
  );
};

export default HeaderSearchBar;
