import React, { useState, useEffect } from "react"; // Import useEffect
import { Sidebar as S, Menu, MenuItem } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"; // Icon for toggle
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import AssessmentIcon from "@mui/icons-material/Assessment";
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
      "Hỏi đáp",
      "Mục tiêu",
      "Pomodoro",
      "Cài đặt",
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

  const [isCollapsed, setIsCollapsed] = useState(() => window.innerWidth <= 1100);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth <= 1100);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
                return getMenuItemStyle(active);
              },
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
            <MenuItem
              icon={<AssessmentIcon />}
              active={activeTab === "Hỏi đáp"}
              onClick={() => handleTabChange("Hỏi đáp", "/qa")}
            >
              Hỏi đáp
            </MenuItem>
            <MenuItem
              disabled={false}
              icon={<SchoolIcon />}
              active={activeTab === "Pomodoro"}
              onClick={() => handleTabChange("Pomodoro", "/pomodoro")}
            >
              Pomodoro
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
