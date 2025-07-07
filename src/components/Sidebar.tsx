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
    const stored = localStorage.getItem("activeTab");
    const validTabs = [
      "Tổng quan",
      "Lịch học",
      "Bài tập",
      "Mục tiêu",
      "Pomodoro",
      "Hiệu suất học tập",
      "Thông báo",
      "Cài đặt"
    ];
    if (stored && validTabs.includes(stored)) {
      return stored;
    }
    return "Tổng quan";
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleTabChange = (tabName: string, route: string) => {
    setActiveTab(tabName);
    navigate(route);
  };

  const getMenuItemStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? "#256A6A" : "transparent",
    margin: "8px 10px",
    borderRadius: "8px",
    color: isActive ? "#ffffff" : theme.palette.text.primary,
    border: isActive ? "2px solid #256A6A" : "2px solid transparent",
    transition: "border-color 0.2s, background-color 0.2s, color 0.2s",
    ...(isActive
      ? {
          "&:hover": {
            backgroundColor: "#256A6A",
          },
        }
      : {
          "&:hover": {
            border: "2px solid #256A6A",
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
          },
        }),
  });
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <S
        style={{
          height: "100%",
          borderRight: `1px solid ${theme.palette.divider}`,
        }} // Use theme for border
        collapsed={isCollapsed}
        breakPoint="sm" // This automatically collapses below 'sm' breakpoint
        backgroundColor={theme.palette.background.paper} // Use theme background color
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
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
