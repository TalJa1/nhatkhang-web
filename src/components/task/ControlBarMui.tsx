import { useState, useEffect } from "react";
import { Menu as MuiMenu, MenuItem as MuiMenuItem } from "@mui/material";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Chip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TaskAPI from "../../api/taskAPI";
import TaskAddDialog from "./TaskAddDialog";

function ControlBarMui({
  onFilterChange,
}: {
  onFilterChange: (filters: {
    subject: string;
    priority: string;
    status: string;
  }) => void;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    subject: "",
    priority: "",
    status: "",
  });
  const [subjects, setSubjects] = useState<string[]>([]);
  // Removed isAllChecked state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Month/year state
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const realMonth = now.getMonth();
  const realYear = now.getFullYear();

  const getMonthYearLabel = (date: Date) => {
    return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleMonthButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMonthMenuClose = () => {
    setAnchorEl(null);
  };

  // Only allow selection among realMonth-1, realMonth, realMonth+1
  const handleMonthSelect = (month: number, year: number) => {
    setSelectedDate(new Date(year, month, 1));
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const tasks: { subject: string }[] = await TaskAPI.getTasks();
        const uniqueSubjects = Array.from(
          new Set(tasks.map((task) => task.subject))
        );
        setSubjects(uniqueSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  const handleFilterClick = () => {
    setShowFilters((prev) => {
      if (prev) {
        // Reset filters when closing the filter row
        setFilters({ subject: "", priority: "", status: "" });
        onFilterChange({ subject: "", priority: "", status: "" });
      }
      return !prev;
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    // Removed setIsAllChecked (no 'Tất cả' button)
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Removed handleAllCheckChange

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
          onClick={handleMonthButtonClick}
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            textTransform: "none",
            color: "text.primary",
            fontWeight: "normal",
            visibility: "hidden",
            fontSize: "1rem",
            p: 0,
            "&:hover": {
              bgcolor: "transparent",
            },
          }}
        >
          {getMonthYearLabel(selectedDate)}
        </Button>
        <MuiMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMonthMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          {/* Previous month */}
          <MuiMenuItem
            onClick={() =>
              handleMonthSelect(
                realMonth - 1 < 0 ? 11 : realMonth - 1,
                realMonth - 1 < 0 ? realYear - 1 : realYear
              )
            }
            selected={
              selectedDate.getMonth() ===
                (realMonth - 1 < 0 ? 11 : realMonth - 1) &&
              selectedDate.getFullYear() ===
                (realMonth - 1 < 0 ? realYear - 1 : realYear)
            }
          >
            {getMonthYearLabel(
              new Date(
                realMonth - 1 < 0 ? realYear - 1 : realYear,
                realMonth - 1 < 0 ? 11 : realMonth - 1,
                1
              )
            )}
          </MuiMenuItem>
          {/* Current month */}
          <MuiMenuItem
            onClick={() => handleMonthSelect(realMonth, realYear)}
            selected={
              selectedDate.getMonth() === realMonth &&
              selectedDate.getFullYear() === realYear
            }
          >
            {getMonthYearLabel(new Date(realYear, realMonth, 1))}
          </MuiMenuItem>
          {/* Next month */}
          <MuiMenuItem
            onClick={() =>
              handleMonthSelect(
                realMonth + 1 > 11 ? 0 : realMonth + 1,
                realMonth + 1 > 11 ? realYear + 1 : realYear
              )
            }
            selected={
              selectedDate.getMonth() ===
                (realMonth + 1 > 11 ? 0 : realMonth + 1) &&
              selectedDate.getFullYear() ===
                (realMonth + 1 > 11 ? realYear + 1 : realYear)
            }
          >
            {getMonthYearLabel(
              new Date(
                realMonth + 1 > 11 ? realYear + 1 : realYear,
                realMonth + 1 > 11 ? 0 : realMonth + 1,
                1
              )
            )}
          </MuiMenuItem>
        </MuiMenu>

        <Box
          sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleDialogOpen}
            sx={{
              bgcolor: "#256A6A",
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

          {/* Removed 'Tất cả' button */}
        </Box>
      </Box>

      {showFilters && (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Chọn môn"
            select
            value={filters.subject}
            onChange={(e) => handleFilterChange("subject", e.target.value)}
            sx={{ minWidth: 150 }}
            color={filters.subject ? "primary" : "info"}
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
            color={filters.priority ? "primary" : "info"}
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
                color={filters.status === status ? "success" : "default"}
                variant={filters.status === status ? "filled" : "outlined"}
                sx={filters.status === status ? { fontWeight: 'bold', border: '2px solid #256A6A' } : {}}
              />
            ))}
          </Box>

          {/* Show selected filters as chips */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {filters.subject && (
              <Chip
                label={`Môn: ${filters.subject}`}
                onDelete={() => handleFilterChange("subject", "")}
                color="primary"
                variant="filled"
              />
            )}
            {filters.priority && (
              <Chip
                label={`Ưu tiên: ${
                  filters.priority === "1" ? "Thấp" : filters.priority === "2" ? "Trung bình" : "Cao"
                }`}
                onDelete={() => handleFilterChange("priority", "")}
                color="primary"
                variant="filled"
              />
            )}
            {filters.status && (
              <Chip
                label={`Trạng thái: ${filters.status}`}
                onDelete={() => handleFilterChange("status", "")}
                color="primary"
                variant="filled"
              />
            )}
          </Box>

          {/* Remove all filters button */}
          {(filters.subject || filters.priority || filters.status) && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setFilters({ subject: "", priority: "", status: "" });
                onFilterChange({ subject: "", priority: "", status: "" });
              }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </Box>
      )}

      <TaskAddDialog open={isDialogOpen} onClose={handleDialogClose} />
    </Box>
  );
}

export default ControlBarMui;
