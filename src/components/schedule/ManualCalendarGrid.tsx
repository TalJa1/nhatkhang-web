import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem as MuiMenuItem,
  useTheme,
  alpha,
  Dialog,
  DialogContent,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  getDate,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  mockCalendarEvents,
  type CalendarEvent,
  type EventCategory,
} from "../../services/calendar/calendarData";
import EventDetailCard from "./EventDetailCard";
import MiniCalendarModal from "./MiniCalendarModal";
import AddEventForm from "./AddEventForm";

// --- Event Colors Helper --- (Same as before)
const getEventColor = (
  category: EventCategory
): { background: string; text: string; border: string } => {
  switch (category) {
    case "Lịch học":
      return { background: "#E0F2E9", text: "#4CAF50", border: "#A5D6A7" };
    case "Kiểm tra":
      return { background: "#FFEBEE", text: "#D32F2F", border: "#EF9A9A" };
    case "Kỳ thi":
      return { background: "#E3F2FD", text: "#1976D2", border: "#90CAF9" };
    case "Sự kiện":
      return { background: "#FFF3E0", text: "#EF6C00", border: "#FFCC80" };
    default:
      return { background: "#F5F5F5", text: "#616161", border: "#E0E0E0" };
  }
};

// --- Calendar Component ---
const ManualCalendarGrid = () => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Initialize with current date
  const [currentView, setCurrentView] = useState("month");
  const [events, setEvents] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [monthAnchorEl, setMonthAnchorEl] = useState<null | HTMLElement>(null);
  const isMonthMenuOpen = Boolean(monthAnchorEl);

  // --- State for Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false); // Single state to open/close modal
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"view" | "add">("view"); // Track modal mode ('view' or 'add')

  // --- Calculations ---
  const daysInGrid = useMemo(() => {
    /* ...no change... */
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { locale: vi, weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { locale: vi, weekStartsOn: 1 });
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const getEventsForDay = useCallback(
    (day: Date): CalendarEvent[] => {
      /* ...no change... */
      return events.filter((event) => isSameDay(event.start, day));
    },
    [events]
  ); // Depend on events state

  const eventsForSelectedDay = useMemo(() => {
    // Filter events for the VIEW mode
    if (!selectedDateForModal) return [];
    return getEventsForDay(selectedDateForModal);
  }, [getEventsForDay, selectedDateForModal]); // Depend on function and selected date

  // --- Handlers ---
  const handleViewChange = (_event: React.SyntheticEvent, newValue: string) => {
    /* ...no change... */
    if (newValue === "month") setCurrentView(newValue);
    else alert(`${newValue} view not implemented in this example.`);
  };
  const handleMonthMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setMonthAnchorEl(event.currentTarget);
  const handleMonthMenuClose = () => setMonthAnchorEl(null);
  const handleNavigate = (action: "prev" | "next" | "today") => {
    const today = new Date(); // Always get the current date

    if (action === "prev") {
      // Previous month from current date (today)
      setCurrentMonth(subMonths(today, 1));
    } else if (action === "next") {
      // Next month from current date (today)
      setCurrentMonth(addMonths(today, 1));
    } else if (action === "today") {
      // Current month (today)
      setCurrentMonth(today);
    }

    handleMonthMenuClose();
  };
  const handleEventClick = (event: CalendarEvent) => {
    /* ...no change... */
    console.log("Event clicked:", event.title);
  };

  // --- Modal Open Handler ---
  const handleDayClick = (day: Date) => {
    console.log("Day selected:", day);
    setSelectedDateForModal(day); // Set the selected date
    setModalMode("view"); // <<-- Always start in view mode
    setIsModalOpen(true); // Open the modal
  };

  // --- Modal Close Handler ---
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optionally reset mode or selected date if needed, but usually not necessary
    // setModalMode('view');
    // setSelectedDateForModal(null);
  };

  // --- Handler to switch Modal to ADD mode ---
  const handleSwitchToAddMode = () => {
    setModalMode("add");
  };

  // --- Handler to switch Modal back to VIEW mode (Cancel from AddForm) ---
  const handleSwitchToViewMode = () => {
    setModalMode("view");
  };

  // --- Handler to SAVE event from AddForm ---
  const handleSaveNewEvent = (newEvent: CalendarEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    // Option 1: Close modal completely after saving
    // handleCloseModal();

    // Option 2: Switch back to view mode for the same date after saving
    setModalMode("view");
  };

  const [loggedInUserName, setLoggedInUserName] = useState("Nguyên");
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setLoggedInUserName(parsedData.displayName ?? "Nguyên");
    }
  }, []);
  const userAvatarSrc = undefined; // Use placeholder from AddEventForm or pass real one

  const dayLabels = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Top Bar: Title, View Tabs, Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexShrink: 0,
        }}
      >
        {/* ... (Copy Toolbar from previous FullCalendar example) ... */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              mr: 3,
              display: { xs: "none", sm: "block" },
            }}
          >
            Lịch học
          </Typography>
          <Tabs
            value={currentView}
            onChange={handleViewChange}
            aria-label="calendar view tabs"
          >
            <Tab
              label="Tháng"
              value="month"
              sx={{ textTransform: "none", fontSize: "0.9rem", minWidth: 80 }}
            />
            <Tab
              label="Tuần"
              value="week"
              sx={{ textTransform: "none", fontSize: "0.9rem", minWidth: 80 }}
              disabled
            />
            <Tab
              label="Ngày"
              value="day"
              sx={{ textTransform: "none", fontSize: "0.9rem", minWidth: 80 }}
              disabled
            />
          </Tabs>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
          sx={{
            backgroundColor: "#256A6A",
            "&:hover": { backgroundColor: "#334257" },
            textTransform: "none",
            borderRadius: "8px",
          }}
          onClick={() => {}} // Replace with modal logic
        >
          Thêm
        </Button>
      </Box>

      {/* Toolbar: Month Selector, Filters */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexShrink: 0,
        }}
      >
        {/* ... (Copy Toolbar from previous FullCalendar example) ... */}
        <Button
          id="month-button"
          aria-controls={isMonthMenuOpen ? "month-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={isMonthMenuOpen ? "true" : undefined}
          onClick={handleMonthMenuOpen}
          endIcon={<ArrowDropDownIcon />}
          sx={{
            textTransform: "none",
            color: "text.primary",
            fontWeight: "bold",
            fontSize: "1rem",
            p: 0.5,
          }}
        >
          {format(currentMonth, "MMMM yyyy", { locale: vi })}
        </Button>
        <Menu
          id="month-menu"
          anchorEl={monthAnchorEl}
          open={isMonthMenuOpen}
          onClose={handleMonthMenuClose}
          MenuListProps={{ "aria-labelledby": "month-button" }}
        >
          <MuiMenuItem onClick={() => handleNavigate("prev")}>
            Tháng trước
          </MuiMenuItem>
          <MuiMenuItem onClick={() => handleNavigate("next")}>
            Tháng sau
          </MuiMenuItem>
          <MuiMenuItem onClick={() => handleNavigate("today")}>
            Hôm nay
          </MuiMenuItem>
        </Menu>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 1,
          }}
        >
          {" "}
          {/* Hide filters on small screens */}
          <Chip
            label="Lịch học"
            size="small"
            variant="outlined"
            clickable
            sx={{ borderColor: "#A5D6A7", color: "#4CAF50" }}
          />
          <Chip
            label="Kiểm tra"
            size="small"
            variant="outlined"
            clickable
            sx={{ borderColor: "#EF9A9A", color: "#D32F2F" }}
          />
          <Chip
            label="Kỳ thi"
            size="small"
            variant="outlined"
            clickable
            sx={{ borderColor: "#90CAF9", color: "#1976D2" }}
          />
          <Chip
            label="Sự kiện"
            size="small"
            variant="outlined"
            clickable
            sx={{ borderColor: "#FFCC80", color: "#EF6C00" }}
          />
          <IconButton
            size="small"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "8px",
              ml: 1,
            }}
          >
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Calendar Grid Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Day Headers */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)", // 7 columns
            backgroundColor: "#256A6A", // Dark background
            color: "#ffffff", // White text
            textAlign: "center",
            borderRadius: "4px 4px 0 0", // Rounded top corners
            flexShrink: 0,
          }}
        >
          {dayLabels.map((label) => (
            <Typography
              key={label}
              variant="caption"
              sx={{ fontWeight: "medium", p: 1 }}
            >
              {label}
            </Typography>
          ))}
        </Box>

        {/* Days Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            flexGrow: 1, // Takes remaining vertical space
            overflowY: "auto", // Allow scrolling if content overflows cell height
            border: "1px solid",
            borderColor: "divider",
            borderTop: "none", // Header has top border effectively
            borderRadius: "0 0 4px 4px", // Rounded bottom corners
            backgroundColor: theme.palette.background.paper, // White background for cells
          }}
        >
          {daysInGrid.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isCurrentDay = isToday(day);

            return (
              <Box
                key={day.toString()}
                onClick={() => handleDayClick(day)}
                sx={{
                  borderRight: "1px solid",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  minHeight: "100px", // Minimum height for cells
                  height: "auto", // Allow cells to grow
                  position: "relative", // For positioning day number
                  p: "4px",
                  cursor: "pointer",
                  backgroundColor: isCurrentDay
                    ? alpha(theme.palette.primary.light, 0.1)
                    : "inherit",
                  "&:nth-of-type(7n)": { borderRight: "none" },
                }}
              >
                {/* Day Number */}
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    top: "4px",
                    left: "4px",
                    fontWeight: isCurrentDay ? "bold" : "normal",
                    color: isCurrentMonth ? "text.primary" : "text.disabled", // Dim non-month days
                  }}
                >
                  {getDate(day)}
                </Typography>

                {/* Events */}
                <Box
                  sx={{
                    mt: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  {dayEvents.map((event) => {
                    const colors = getEventColor(event.category);
                    return (
                      <Box
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }} // Prevent day click
                        sx={{
                          backgroundColor: colors.background,
                          color: colors.text,
                          borderLeft: `3px solid ${colors.border}`,
                          padding: "1px 4px",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          lineHeight: 1.2,
                        }}
                      >
                        <b>{event.title}</b>
                        {event.description && (
                          <Typography
                            variant="caption"
                            component="div"
                            sx={{
                              fontStyle: "italic",
                              opacity: 0.9,
                              lineHeight: 1,
                            }}
                          >
                            {event.description}
                          </Typography>
                        )}
                        {!event.allDay && format(event.start, "HH:mm")}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="md" // Or potentially "lg" if the form needs more space
        fullWidth
        // Adjust PaperProps for desired height and potentially width breakpoints
        PaperProps={{
          sx: { height: "85vh", maxHeight: "700px", borderRadius: "16px" },
        }}
        sx={{ backdropFilter: "blur(3px)" }} // Optional: blurred background
      >
        <DialogContent sx={{ p: 0, height: "100%", overflow: "hidden" }}>
          <Grid container sx={{ height: "100%" }}>
            {/* Left Side: Mini Calendar (Always Visible) */}
            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{
                borderRight: { md: "1px solid" },
                borderColor: { md: "divider" },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f8f9fa",
              }}
            >
              {selectedDateForModal && (
                <MiniCalendarModal
                  initialDate={selectedDateForModal}
                  selectedDate={selectedDateForModal}
                  onClose={handleCloseModal} // Close button closes the whole dialog
                />
              )}
            </Grid>

            {/* Right Side: Conditional Rendering (View List OR Add Form) */}
            <Grid
              size={{ xs: 12, md: 7 }}
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
              }}
            >
              {selectedDateForModal && modalMode === "view" && (
                // --- VIEW MODE CONTENT ---
                <Box
                  sx={{
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#D32F2F",
                      mb: 2,
                      flexShrink: 0,
                    }}
                  >
                    {format(
                      selectedDateForModal,
                      "'Ngày' dd 'tháng' MM 'năm' yyyy",
                      { locale: vi }
                    )}
                  </Typography>
                  {/* Scrollable Event List */}
                  <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2, pr: 1 }}>
                    {eventsForSelectedDay.length > 0 ? (
                      eventsForSelectedDay.map((event) => (
                        <EventDetailCard key={event.id} event={event} />
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", mt: 4 }}
                      >
                        {" "}
                        Không có sự kiện nào cho ngày này.{" "}
                      </Typography>
                    )}
                  </Box>
                  {/* Button to switch to Add Mode */}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSwitchToAddMode} // <-- Switch to ADD mode
                    sx={{
                      backgroundColor: "#e0e0e0",
                      color: theme.palette.text.primary,
                      "&:hover": { backgroundColor: "#bdbdbd" },
                      mt: "auto",
                      flexShrink: 0,
                      borderRadius: "8px",
                      py: 1.2,
                      fontWeight: "medium",
                      boxShadow: "none",
                      textTransform: "none",
                    }}
                  >
                    Thêm sự kiện
                  </Button>
                </Box>
                // --- END VIEW MODE CONTENT ---
              )}

              {selectedDateForModal && modalMode === "add" && (
                // --- ADD MODE CONTENT ---
                <AddEventForm
                  selectedDate={selectedDateForModal}
                  userName={loggedInUserName}
                  avatarSrc={userAvatarSrc}
                  onSave={handleSaveNewEvent} // <-- Pass save handler
                  onCancel={handleSwitchToViewMode} // <-- Pass cancel handler (goes back to view)
                />
                // --- END ADD MODE CONTENT ---
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ManualCalendarGrid;
