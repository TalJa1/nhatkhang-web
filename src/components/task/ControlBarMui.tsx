import { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Chip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TaskAPI from "../../api/taskAPI";
import TaskAddDialog from "./TaskAddDialog";

function ControlBarMui({ onFilterChange }: { onFilterChange: (filters: { subject: string; priority: string; status: string }) => void }) {
  const [showFilters, setShowFilters] = useState(false); // Default to false to hide the filter row initially
  const [filters, setFilters] = useState({
    subject: "",
    priority: "",
    status: "",
  });
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isAllChecked, setIsAllChecked] = useState(false); // New state to manage checkbox
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const tasks: { subject: string }[] = await TaskAPI.getTasks();
        const uniqueSubjects = Array.from(new Set(tasks.map((task) => task.subject)));
        setSubjects(uniqueSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  const handleFilterClick = () => {
    setShowFilters(!showFilters); // Toggle the visibility of the filter row
    if (showFilters) {
      // Reset filters when closing the filter row
      setFilters({ subject: "", priority: "", status: "" });
      onFilterChange({ subject: "", priority: "", status: "" });
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleAllCheckChange = (checked: boolean) => {
    setIsAllChecked(checked);
    if (checked) {
      setFilters({ subject: "", priority: "", status: "" });
      onFilterChange({ subject: "", priority: "", status: "" });
    }
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: { xs: 1, sm: 2 },
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          onClick={() => console.log("Date selector clicked")}
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            textTransform: "none",
            color: "text.primary",
            fontWeight: "normal",
            fontSize: "1rem",
            p: 0,
            "&:hover": {
              bgcolor: "transparent",
            },
          }}
        >
          Tháng 4/2025
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleDialogOpen}
            sx={{
              bgcolor: "#2c3e50",
              color: "#fff",
              "&:hover": {
                bgcolor: "#34495e",
              },
            }}
          >
            Thêm
          </Button>

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            sx={{
              color: "text.secondary",
              borderColor: "grey.400",
              "&:hover": {
                borderColor: "grey.600",
                bgcolor: "action.hover",
              },
            }}
          >
            Lọc
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAllChecked}
                  onChange={(e) => handleAllCheckChange(e.target.checked)}
                />
              }
              label="Tất cả"
              sx={{ minWidth: 150 }}
            />
          </Box>
        </Box>
      </Box>

      {showFilters && (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
          <TextField
            label="Chọn môn"
            select
            value={filters.subject}
            onChange={(e) => handleFilterChange("subject", e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {subjects.map((subject) => (
              <MenuItem key={subject} value={subject}>
                {subject}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Mức ưu tiên"
            select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="1">Thấp</MenuItem>
            <MenuItem value="2">Trung bình</MenuItem>
            <MenuItem value="3">Cao</MenuItem>
          </TextField>

          <Box sx={{ display: "flex", gap: 1 }}>
            {["Hoàn thành", "Đang làm", "Quá hạn"].map((status) => (
              <Chip
                key={status}
                label={status}
                onClick={() => handleFilterChange("status", status)}
                color={filters.status === status ? "primary" : "default"}
                variant={filters.status === status ? "filled" : "outlined"}
              />
            ))}
          </Box>
        </Box>
      )}

      <TaskAddDialog open={isDialogOpen} onClose={handleDialogClose} />
    </Box>
  );
}

export default ControlBarMui;