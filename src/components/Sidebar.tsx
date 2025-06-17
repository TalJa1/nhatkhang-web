import React, { useState, useEffect } from "react"; // Import useEffect
import { Sidebar as S, Menu, MenuItem } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"; // Icon for toggle
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, useTheme } from "@mui/material"; // Import IconButton, Typography, useTheme
import logo from "../assets/sidebar/logo.png";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const theme = useTheme(); // Access MUI theme for styling if needed
  const [activeTab, setActiveTab] = useState(() => {
    // Retrieve active tab from localStorage or default to "Tổng quan"
    return localStorage.getItem("activeTab") || "Tổng quan";
  });
  const navigate = useNavigate();

  // Save activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // --- State for collapsed status ---
  // Start collapsed by default, or false if you want it expanded on large screens initially
  const [isCollapsed, setIsCollapsed] = useState(false);
  // --- ---

  const handleTabChange = (tabName: string, route: string) => {
    setActiveTab(tabName);
    navigate(route);
    // Optional: If on a small screen where breakPoint is active,
    // you might want to manually close the sidebar after navigation
    // if you were using the toggled state for mobile drawers.
    // However, with breakPoint controlling collapse, this might not be needed.
  };

  const getMenuItemStyle = (isActive: boolean) => ({
    // Use theme colors for better consistency
    backgroundColor: isActive
      ? "#1C1E30" // Example using theme color
      : "transparent",
    margin: "8px 10px", // Adjust margin slightly
    borderRadius: "8px",
    color: isActive
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary, // Adjust text colors
    // Add hover effect
    "&:hover": {
      backgroundColor: !isActive
        ? theme.palette.action.hover
        : theme.palette.action.selected,
      // color: isActive ? theme.palette.primary.contrastText : theme.palette.primary.main, // Optional hover text color change
    },
    // Apply styles directly using sx prop on MenuItem for better integration
  });

  return (
    <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
      <S
        style={{
          height: "100%",
          borderRight: `1px solid ${theme.palette.divider}`,
        }} // Use theme for border
        // --- Use state for collapsed ---
        collapsed={isCollapsed}
        // --- ---
        // collapsedWidth={"80px"} // Default is 80px, adjust if needed (60px is quite narrow)
        breakPoint="sm" // This automatically collapses below 'sm' breakpoint
        backgroundColor={theme.palette.background.paper} // Use theme background color
        // Toggled state is more for temporary mobile drawers, breakPoint handles persistent collapse
        // onToggle={() => console.log("Toggled")} // You might need this if using toggled state instead of breakPoint
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header Section with Toggle */}
          <Box
            sx={{
              padding: "15px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "space-between", // Center icon when collapsed
              borderBottom: `1px solid ${theme.palette.divider}`,
              minHeight: "64px", // Match typical header height
            }}
          >
            {/* --- Conditionally render logo/title --- */}
            {!isCollapsed && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  width={100} // Adjust size as needed
                />
                <Box>Smart Study Planner</Box>
              </Box>
            )}
            {/* Always show toggle button */}
            <IconButton
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label="toggle sidebar"
            >
              <MenuOutlinedIcon />
            </IconButton>
          </Box>

          {/* Menu Items */}
          <Menu
            menuItemStyles={{
              button: ({ active }) => {
                // Apply styles directly here using sx prop logic is often cleaner
                return getMenuItemStyle(active);
              },
              // You can customize other parts like icons etc.
              // icon: ({ level, active, disabled }) => {
              //    return { color: active ? 'white' : 'black' };
              // },
            }}
          >
            <MenuItem
              icon={<HomeFilledIcon />}
              active={activeTab === "Tổng quan"}
              onClick={() => handleTabChange("Tổng quan", "/home")}
              // No need for style prop here if using menuItemStyles
            >
              Tổng quan
            </MenuItem>
            <MenuItem
              icon={<CalendarMonthIcon />}
              active={activeTab === "Lịch học"}
              onClick={() => handleTabChange("Lịch học", "/schedule")}
            >
              Lịch học
            </MenuItem>
            <MenuItem
              icon={<HomeWorkIcon />}
              active={activeTab === "Bài tập"}
              onClick={() => handleTabChange("Bài tập", "/homeworks")}
            >
              Bài tập
            </MenuItem>
            {/* Add other MenuItems similarly */}
            <MenuItem
              disabled={true}
              icon={<StarIcon />}
              active={activeTab === "Mục tiêu"}
              onClick={() => handleTabChange("Mục tiêu", "/goals")}
            >
              Mục tiêu
            </MenuItem>
            <MenuItem
              disabled={true}
              icon={<SchoolIcon />}
              active={activeTab === "Pomodoro"}
              onClick={() => handleTabChange("Pomodoro", "/pomodoro")}
            >
              Pomodoro
            </MenuItem>
            <MenuItem
              disabled={true}
              icon={<AssessmentIcon />}
              active={activeTab === "Hiệu suất học tập"}
              onClick={() =>
                handleTabChange("Hiệu suất học tập", "/performance")
              }
            >
              Hiệu suất học tập
            </MenuItem>
            <MenuItem
              disabled={true}
              icon={<NotificationsIcon />}
              active={activeTab === "Thông báo"}
              onClick={() => handleTabChange("Thông báo", "/notifications")}
            >
              Thông báo
            </MenuItem>
            {/* Spacer Item - push settings to bottom */}
            {/* <Box sx={{ flexGrow: 1 }} />  */}
            {/* This spacer might need to be placed differently depending on layout */}
            <MenuItem
              disabled={true}
              icon={<SettingsIcon />}
              active={activeTab === "Cài đặt"}
              onClick={() => handleTabChange("Cài đặt", "/settings")}
            >
              Cài đặt
            </MenuItem>
          </Menu>
        </Box>
      </S>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3, // Add padding to the main content area
          overflowY: "auto", // Allow content scrolling
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
