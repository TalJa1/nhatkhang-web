// src/components/AddEventForm.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  useTheme,
  alpha,
  Grid,
  type SelectChangeEvent, // Using Grid for layout consistency
} from "@mui/material";// Adjust path as needed
import {
  format,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";
import { vi } from "date-fns/locale";

// Placeholder avatar - replace with actual logic if needed
// Make sure this path is correct relative to your project structure
import userAvatarPlaceholder from "../../assets/home/avatar.png";
import type { CalendarEvent, EventCategory } from "../../services/calendar/calendarData";

// --- Component Props Interface ---
interface AddEventFormProps {
  selectedDate: Date;
  userName: string;
  avatarSrc?: string;
  onSave: (newEvent: CalendarEvent) => void;
  onCancel: () => void; // Function to switch back to view mode or close
}

// --- Constants ---
const availableCategories: EventCategory[] = [
  "Lịch học",
  "Kiểm tra",
  "Kỳ thi",
  "Sự kiện",
];
const availableSubjects = [
  "Toán",
  "Văn",
  "Lý",
  "Hóa",
  "Sinh",
  "Sử",
  "Địa",
  "Anh",
]; // Example subjects
const reminderOptions = [
  "Không",
  "Khi bắt đầu",
  "5 phút trước",
  "15 phút trước",
  "30 phút trước",
  "1 giờ trước",
  "1 ngày trước",
  "2 ngày trước",
];

// --- Component ---
const AddEventForm: React.FC<AddEventFormProps> = ({
  selectedDate,
  userName,
  avatarSrc = userAvatarPlaceholder,
  onSave,
}) => {
  const theme = useTheme();

  // --- Form State ---
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory | null>("Lịch học"); // Default selection
  const [subject, setSubject] = useState("");
  const [startTime, setStartTime] = useState("09:00"); // Default start time e.g., 09:00
  const [endTime, setEndTime] = useState("10:00"); // Default end time e.g., 10:00
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("2 ngày trước"); // Default reminder
  const [notes, setNotes] = useState("");

  // --- Handlers ---
  const handleCategoryChange = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: EventCategory | null
  ) => {
    // Allow deselecting if needed, but toggle button group usually prevents null unless `exclusive` is off
    if (newCategory !== null) {
      setCategory(newCategory);
    }
  };

  const handleSubjectChange = (event: SelectChangeEvent<string>) => {
    setSubject(event.target.value as string);
  };

  const handleReminderTimeChange = (event: SelectChangeEvent<string>) => {
    setReminderTime(event.target.value as string);
  };

  // --- Save Logic ---
  const handleSaveClick = () => {
    if (!title.trim() || !category) {
      alert("Vui lòng nhập tiêu đề và chọn loại lịch.");
      return;
    }

    let startDateWithTime = selectedDate;
    let endDateWithTime: Date | undefined = undefined;
    let isAllDay = true; // Assume allDay unless valid time is parsed

    try {
      if (startTime) {
        // Only process if startTime is not empty
        const [startHour, startMinute] = startTime.split(":").map(Number);
        if (!isNaN(startHour) && !isNaN(startMinute)) {
          startDateWithTime = setMilliseconds(
            setSeconds(
              setMinutes(setHours(selectedDate, startHour), startMinute),
              0
            ),
            0
          );
          isAllDay = false; // Valid start time means not all day

          // Process end time only if start time was valid
          if (endTime) {
            const [endHour, endMinute] = endTime.split(":").map(Number);
            // Ensure end time is valid and after start time
            if (
              !isNaN(endHour) &&
              !isNaN(endMinute) &&
              (endHour > startHour ||
                (endHour === startHour && endMinute > startMinute))
            ) {
              endDateWithTime = setMilliseconds(
                setSeconds(
                  setMinutes(setHours(selectedDate, endHour), endMinute),
                  0
                ),
                0
              );
            } else if (!isNaN(endHour) && !isNaN(endMinute)) {
              console.warn(
                "End time is not after start time. Event might end at start time or have default duration depending on backend/display logic."
              );
              // Option: Set end time same as start? Or add default duration?
              // endDateWithTime = startDateWithTime; // Example: Ends immediately
              // endDateWithTime = addHours(startDateWithTime, 1); // Example: Default 1 hour
            }
          }
        } else {
          console.warn("Invalid start time format, treating as all-day event.");
        }
      }
    } catch (e) {
      console.error("Error parsing time:", e);
      isAllDay = true; // Fallback to allDay on error
      endDateWithTime = undefined;
    }

    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}-${Math.random()}`, // Replace with proper UUID
      title: title.trim(),
      start: startDateWithTime,
      end: endDateWithTime,
      allDay: isAllDay,
      category: category, // Non-null asserted because of validation
      description: notes.trim(),
      // Add other relevant fields like subject, reminder configuration if needed
    };
    onSave(newEvent); // Call the save callback passed from parent
  };

  // --- Common Styles ---
  const inputBackground = alpha(theme.palette.grey[500], 0.05);
  const inputBorderRadius = "8px";
  const timeInputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: inputBorderRadius,
      backgroundColor: inputBackground,
    },
    "& .MuiOutlinedInput-input": {
      textAlign: "center",
      padding: "8px 10px",
      fontSize: "0.9rem",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(theme.palette.grey[500], 0.2),
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(theme.palette.grey[500], 0.4),
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
      borderWidth: "1px", // Ensure focused border isn't thicker
    },
  };

  function getEventColor(cat: string) {
    // Example implementation: Return colors based on category
    const categoryColors: Record<string, { text: string; border: string }> = {
      "Lịch học": { text: "#ffffff", border: "#1976d2" },
      "Kiểm tra": { text: "#ffffff", border: "#d32f2f" },
      "Kỳ thi": { text: "#ffffff", border: "#388e3c" },
      "Sự kiện": { text: "#ffffff", border: "#fbc02d" },
    };
    return categoryColors[cat] || { text: "#000000", border: "#9e9e9e" }; // Default colors
  }

  // --- Render ---
  return (
    // Use padding and allow vertical scrolling within the form area
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 2.5,
        overflowY: "auto",
      }}
    >
      {/* User Info Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 1,
          flexShrink: 0,
        }}
      >
        <Avatar alt={userName} src={avatarSrc} sx={{ width: 40, height: 40 }} />
        <Box>
          {/* Displaying selected date for context */}
          <Typography variant="caption" color="text.secondary">
            {format(selectedDate, "'Thêm vào' dd/MM/yyyy", { locale: vi })}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
            Nhập tên sự kiện
          </Typography>
        </Box>
      </Box>

      {/* Event Title */}
      <TextField
        placeholder="Thêm tiêu đề..."
        fullWidth
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{
          mb: 2.5,
          "& .MuiOutlinedInput-root": {
            borderRadius: inputBorderRadius,
            bgcolor: inputBackground,
          },
          "& .MuiOutlinedInput-input": {
            padding: "10px 14px",
            fontWeight: 500,
          }, // Make input text bold
        }}
        autoFocus // Focus this field when form appears
      />

      {/* Category Selection */}
      <Typography
        variant="caption"
        display="block"
        color="text.secondary"
        sx={{ mb: 1, fontWeight: 500 }}
      >
        Phân loại lịch:
      </Typography>
      <ToggleButtonGroup
        value={category}
        exclusive
        onChange={handleCategoryChange}
        aria-label="Event category"
        size="small"
        sx={{
          mb: 2.5,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
          gap: 1,
        }}
      >
        {availableCategories.map((cat) => (
          <ToggleButton
            key={cat}
            value={cat}
            sx={{
              borderRadius: "8px !important",
              border: `1px solid ${alpha(
                theme.palette.grey[500],
                0.3
              )} !important`, // Slightly darker border
              textTransform: "none",
              color: theme.palette.text.secondary, // Default text color
              backgroundColor: alpha(theme.palette.grey[500], 0.04), // Very light grey background
              "&:hover": {
                backgroundColor: alpha(theme.palette.grey[500], 0.08),
              },
              "&.Mui-selected": {
                // Use text color matching the category color for better visual association
                color: 'black',
                borderColor: `${getEventColor(cat).border} !important`,
                backgroundColor: alpha(getEventColor(cat).border, 0.1), // Background based on border color
                "&:hover": {
                  backgroundColor: alpha(getEventColor(cat).border, 0.15),
                },
              },
            }}
          >
            {cat}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Subject & Time Row */}
      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          {/* Subject Dropdown */}
          <FormControl fullWidth size="small">
            <Typography
              variant="caption"
              component="label"
              htmlFor="start-time"
              sx={{
                mb: 0.5,
                display: "block",
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              Chọn môn
            </Typography>

            <Select
              labelId="subject-label"
              label="Chọn môn"
              value={subject}
              onChange={handleSubjectChange}
              sx={{
                borderRadius: inputBorderRadius,
                backgroundColor: inputBackground,
                fontSize: "0.9rem",
              }}
            >
              <MenuItem value="" sx={{ fontSize: "0.9rem" }}>
                <em>Không chọn</em>
              </MenuItem>
              {availableSubjects.map((sub) => (
                <MenuItem key={sub} value={sub} sx={{ fontSize: "0.9rem" }}>
                  {sub}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          {/* Start Time */}
          <FormControl fullWidth size="small">
            {/* Floating label outside for time */}
            <Typography
              variant="caption"
              component="label"
              htmlFor="start-time"
              sx={{
                mb: 0.5,
                display: "block",
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              TG bắt đầu
            </Typography>
            <TextField
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              sx={timeInputSx}
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          {/* End Time */}
          <FormControl fullWidth size="small">
            <Typography
              variant="caption"
              component="label"
              htmlFor="end-time"
              sx={{
                mb: 0.5,
                display: "block",
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              TG kết thúc
            </Typography>
            <TextField
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              sx={timeInputSx}
            />
          </FormControl>
        </Grid>
      </Grid>

      {/* Reminder Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: "medium" }}>
          Nhắc nhở
        </Typography>
        <Switch
          checked={isReminderEnabled}
          onChange={(e) => setIsReminderEnabled(e.target.checked)}
          size="small"
        />
      </Box>
      <FormControl
        fullWidth
        size="small"
        sx={{ mb: 2.5 }}
        disabled={!isReminderEnabled}
      >
        <InputLabel id="reminder-time-label" sx={{ fontSize: "0.9rem" }}>
          Thông báo trước thời gian bắt đầu
        </InputLabel>
        <Select
          labelId="reminder-time-label"
          label="Thông báo trước thời gian bắt đầu"
          value={reminderTime}
          onChange={handleReminderTimeChange}
          sx={{
            borderRadius: inputBorderRadius,
            backgroundColor: inputBackground,
            fontSize: "0.9rem",
          }}
        >
          {reminderOptions.map((opt) => (
            <MenuItem key={opt} value={opt} sx={{ fontSize: "0.9rem" }}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Notes Section */}
      <TextField
        label="Ghi chú"
        multiline
        rows={3} // Adjust rows as needed
        fullWidth
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        variant="outlined"
        InputLabelProps={{ sx: { fontSize: "0.9rem" } }}
        sx={{
          mb: 2.5,
          "& .MuiOutlinedInput-root": {
            borderRadius: inputBorderRadius,
            bgcolor: inputBackground,
            padding: "8px 12px",
          }, // Adjust padding
          "& .MuiInputBase-multiline": { fontSize: "0.9rem" },
        }}
      />

      {/* Save Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleSaveClick}
        disabled={!title.trim() || !category} // Basic validation
        sx={{
          backgroundColor: alpha(theme.palette.grey[500], 0.1),
          color: alpha(theme.palette.text.primary, 0.6),
          fontWeight: "bold",
          borderRadius: inputBorderRadius,
          py: 1.2,
          mt: "auto", // Push to bottom if container allows
          boxShadow: "none",
          textTransform: "none",
          "&:hover": {
            backgroundColor: alpha(theme.palette.grey[500], 0.15),
            boxShadow: "none",
          },
          "&:disabled": {
            backgroundColor: alpha(
              theme.palette.action.disabledBackground,
              0.5
            ),
            color: alpha(theme.palette.action.disabled, 0.7),
            cursor: "not-allowed",
            pointerEvents: "auto", // Ensure tooltip might still work if needed
          },
        }}
      >
        Lưu lịch học
      </Button>
      {/* You can optionally add a Cancel button here that calls `onCancel` */}
      {/* <Button fullWidth onClick={onCancel} sx={{ mt: 1, textTransform: 'none' }}>Quay lại</Button> */}
    </Box>
  );
};

export default AddEventForm;
