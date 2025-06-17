import { Box } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import HeaderSearchBar from "../../components/HeaderSearchBar";
import ManualCalendarGrid from "../../components/schedule/ManualCalendarGrid";
import { useEffect, useState } from "react";

const ScheduleView = () => {
  const [loggedInUserName, setLoggedInUserName] = useState("Nguyên");
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setLoggedInUserName(parsedData.displayName ?? "Nguyên");
    }
  }, []);

  const ScheduleContent = () => {
    return (
      <div className="schedule-content">
        <Box
          sx={{ padding: 2, borderBottom: "1px solid", borderColor: "divider" }}
        >
          <HeaderSearchBar userName={loggedInUserName} />
        </Box>
        <Box sx={{ flexGrow: 1, overflow: "hidden", width: "100%" }}>
          <ManualCalendarGrid />
        </Box>
      </div>
    );
  };

  return (
    <div className="app-container">
      <Sidebar children={<ScheduleContent />} />
    </div>
  );
};

export default ScheduleView;
