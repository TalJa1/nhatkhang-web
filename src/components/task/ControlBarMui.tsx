import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import TaskAddDialog from "./TaskAddDialog";
import FilterDialog from "./FilterDialog";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";

interface filtersType {
  subject: string;
  priority: string;
  status: string;
}

interface ControlBarMuiProps {
  onFilterChange?: (filters: filtersType) => void;
  onAddClick?: () => void;
  onFilterClick?: () => void;
  onTaskAdded?: () => void;
}


const ControlBarMui: React.FC<ControlBarMuiProps> = ({
  onFilterChange,
  onAddClick,
  onFilterClick,
  onTaskAdded,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState({ subject: "", priority: "", status: "" });

  const handleAddClick = () => {
    setOpenDialog(true);
    if (onAddClick) onAddClick();
  };


  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleFilterClick = () => {
    setOpenFilter(true);
    if (onFilterClick) onFilterClick();
  };

  const handleFilterClose = () => {
    setOpenFilter(false);
  };

  const handleApplyFilter = (newFilters: { subject: string; priority: string; status: string }) => {
    setFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          pt: 2,
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#2E7D78",
            borderRadius: "8px",
            fontWeight: 500,
            fontSize: "16px",
            textTransform: "none",
            px: 3,
            boxShadow: "none",
            "&:hover": { backgroundColor: "#25635F" },
          }}
          onClick={handleAddClick}
        >
          Thêm
        </Button>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          sx={{
            color: "#2E7D78",
            borderColor: "#2E7D78",
            borderRadius: "8px",
            fontWeight: 500,
            fontSize: "16px",
            textTransform: "none",
            px: 3,
            "&:hover": {
              backgroundColor: "#F5F5F5",
              borderColor: "#25635F",
            },
          }}
          onClick={handleFilterClick}
        >
          Lọc
        </Button>
      </Box>
      <TaskAddDialog open={openDialog} onClose={handleDialogClose} onTaskAdded={onTaskAdded} />
      <FilterDialog
        open={openFilter}
        onClose={handleFilterClose}
        onApply={handleApplyFilter}
        initialFilters={filters}
      />
    </>
  );
};

export default ControlBarMui;
