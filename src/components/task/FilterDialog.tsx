import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Chip,
  Button,
  DialogActions,
} from "@mui/material";

const SUBJECTS = [
  "Toán",
  "Văn",
  "Tiếng Anh",
  "Lịch sử",
  "Địa Lý",
  "Vật Lý",
  "Hóa Học",
  "Sinh Học",
  "Công Nghệ",
  "Giáo Dục Công Dân",
];
const PRIORITIES = [
  { label: "Thấp", value: 1 },
  { label: "Trung bình", value: 2 },
  { label: "Cao", value: 3 },
];
const STATUSES = ["Hoàn thành", "Đang làm", "Quá hạn"];

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: { subject: string; priority: string; status: string }) => void;
  initialFilters?: { subject: string; priority: string; status: string };
}

const FilterDialog: React.FC<FilterDialogProps> = ({ open, onClose, onApply, initialFilters }) => {

  const [selected, setSelected] = useState({
    subject: initialFilters?.subject || "",
    priority: initialFilters?.priority || "",
    status: initialFilters?.status || "",
  });


  const handleChipClick = (
    field: "subject" | "priority" | "status",
    value: string | number
  ) => {
    setSelected((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }));
  };

  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Lọc bài tập</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography fontWeight="bold" mb={1}>Môn</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {SUBJECTS.map((subject) => (
              <Chip
                key={subject}
                label={subject}
                clickable
                color={selected.subject === subject ? "primary" : "default"}
                onClick={() => handleChipClick("subject", subject)}
              />
            ))}
          </Box>
        </Box>
        <Box mb={2}>
          <Typography fontWeight="bold" mb={1}>Mức ưu tiên</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {PRIORITIES.map((priority) => (
              <Chip
                key={priority.value}
                label={priority.label}
                clickable
                color={Number(selected.priority) === priority.value ? "primary" : "default"}
                onClick={() => handleChipClick("priority", priority.value)}
              />
            ))}
          </Box>
        </Box>
        <Box mb={2}>
          <Typography fontWeight="bold" mb={1}>Trạng thái</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {STATUSES.map((status) => (
              <Chip
                key={status}
                label={status}
                clickable
                color={selected.status === status ? "primary" : "default"}
                onClick={() => handleChipClick("status", status)}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleApply}>Áp dụng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
