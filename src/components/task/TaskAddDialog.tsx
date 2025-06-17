import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Chip,
  Switch,
  FormControl,
  Select,
  MenuItem,
  type DialogProps,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import LeftCalendar from "./LeftCalendar";
import { fetchTasksByDate } from "../../api/taskAPI"; // Assuming this is a named export
import TaskAPI from "../../api/taskAPI"; // Assuming this is a named export
import type { Task, TaskAdd } from "../../models/tabs/taskModel";

interface TaskAddDialogProps {
  open: boolean;
  onClose: () => void;
}

const TaskAddDialog: React.FC<TaskAddDialogProps> = ({ open, onClose }) => {
  const [swt, setSwt] = useState(false);
  const [clickedBox, setClickedBox] = useState(0)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false); // New state to track if the mode is update or post
  const [notificationDays, setNotificationDays] = useState(1);
  const [newTaskData, setNewTaskData] = useState<TaskAdd>({
    user_id: 4, // Replace with actual user_id
    title: "",
    subject: "Toán",
    due_date: selectedDate.toISOString().split('T')[0], // Correctly format the date without time zone offset
    priority: 1, // Default priority
    status: "Đang làm", // Default status
    description: "", // Default description
  });

  const dialogProps: DialogProps = {
    disablePortal: true, // Prevents creating a new portal for the dialog
    disableEnforceFocus: true, // Avoids enforcing focus on the dialog
    disableScrollLock: true,
    open: false,
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddTask = () => {
    setIsAddingTask(true);
    setIsUpdateMode(false); // Set to post mode when clicking the add button
  };

  const handleTaskClick = (task: Task) => {
    setClickedBox(task.task_id)
    setIsAddingTask(true);
    setIsUpdateMode(true); // Set to update mode when clicking on a task box
    setNewTaskData({
      user_id: task.user_id,
      title: task.title,
      subject: task.subject,
      due_date: task.due_date,
      priority: task.priority,
      status: task.status,
      description: task.description,
    });
  };

  const handleSaveTask = async () => {
    try {
      if (isUpdateMode) {
        // If in update mode, call the update API
        await TaskAPI.updateTask(clickedBox, newTaskData); // Assuming updateTask is an API function
      } else {
        // Otherwise, call the create API
        await TaskAPI.createTask(newTaskData); // Assuming createTask is an API function
      }
      setIsAddingTask(false);
      // Optionally, refresh tasks or show a success message
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  useEffect(() => {
    if (open) {
      setSelectedDate(new Date());
    }
  }, [open]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await fetchTasksByDate(selectedDate);
        setTasks(tasksData);
        setNewTaskData((prevData) => ({
          ...prevData,
          due_date: selectedDate.toLocaleDateString('en-CA'), // Correctly format the date without timezone offset
        }));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [selectedDate]);

  useEffect(() => {
    setIsAddingTask(false);
  }, [selectedDate, open]);

  return (
    <Dialog
      {...dialogProps}
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogContent sx={{ height: "60vh" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr", // Equal width for left and right sides
            gap: 2,
            height: "100%",
          }}
        >
          {/* Left Side: Calendar and Close Button */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ flex: 1, borderRight: "1px solid #ddd", pr: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Thời hạn
              </Typography>
              <LeftCalendar
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  color: "text.primary",
                  borderColor: "divider",
                  textTransform: "none",
                  width: "80%",
                  fontWeight: "medium",
                }}
              >
                Đóng
              </Button>
            </Box>
          </Box>

          {/* Right Side: Task List and Add Button */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ color: "#D55455", textAlign: "center", mb: 2 }}
            >
              Ngày {selectedDate.getDate()} tháng {selectedDate.getMonth() + 1}{" "}
              năm {selectedDate.getFullYear()}
            </Typography>
            <Box sx={{ flex: 1, pl: 2 }}>
              {isAddingTask ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <img
                      src="/src/assets/home/avatar.png"
                      alt="Avatar"
                      style={{ width: 50, height: 50, borderRadius: "50%" }}
                    />
                    <input
                      type="text"
                      placeholder="Nhập tiêu đề bài tập"
                      value={newTaskData.title}
                      onChange={(e) =>
                        setNewTaskData({
                          ...newTaskData,
                          title: e.target.value,
                        })
                      }
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        Mức độ ưu tiên
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          sx={{
                            bgcolor:
                              newTaskData.priority === 3 ? "#1C1E30" : "",
                            color: newTaskData.priority === 3 ? "#fff" : "",
                          }}
                          onClick={() =>
                            setNewTaskData({ ...newTaskData, priority: 3 })
                          }
                        >
                          Cao
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{
                            bgcolor:
                              newTaskData.priority === 2 ? "#1C1E30" : "",
                            color: newTaskData.priority === 2 ? "#fff" : "",
                          }}
                          onClick={() =>
                            setNewTaskData({ ...newTaskData, priority: 2 })
                          }
                        >
                          Trung bình
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{
                            bgcolor:
                              newTaskData.priority === 1 ? "#1C1E30" : "",
                            color: newTaskData.priority === 1 ? "#fff" : "",
                          }}
                          onClick={() =>
                            setNewTaskData({ ...newTaskData, priority: 1 })
                          }
                        >
                          Thấp
                        </Button>
                      </Box>
                    </Box>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        Chọn môn
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          labelId="subject-select-label"
                          id="subject-select"
                          value={newTaskData.subject}
                          onChange={(e) =>
                            setNewTaskData({
                              ...newTaskData,
                              subject: e.target.value,
                            })
                          }
                        >
                          <MenuItem value="Toán">Toán</MenuItem>
                          <MenuItem value="Văn">Văn</MenuItem>
                          <MenuItem value="Tiếng Anh">Tiếng Anh</MenuItem>
                          <MenuItem value="Lịch Sử">Lịch Sử</MenuItem>
                          <MenuItem value="Địa Lý">Địa Lý</MenuItem>
                          <MenuItem value="Vật Lý">Vật Lý</MenuItem>
                          <MenuItem value="Hóa Học">Hóa Học</MenuItem>
                          <MenuItem value="Sinh Học">Sinh Học</MenuItem>
                          <MenuItem value="Công Nghệ">Công Nghệ</MenuItem>
                          <MenuItem value="Giáo Dục Công Dân">
                            Giáo Dục Công Dân
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Nhắc nhở
                    </Typography>
                    <Switch
                      checked={swt}
                      onChange={() => {
                        setSwt(!swt);
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Thông báo trước hạn nộp
                    </Typography>
                    <FormControl>
                      <Select
                        labelId="notification-select-label"
                        id="notification-select"
                        value={notificationDays}
                        onChange={(e) =>
                          setNotificationDays(Number(e.target.value))
                        }
                      >
                        <MenuItem value={1}>1 ngày</MenuItem>
                        <MenuItem value={2}>2 ngày</MenuItem>
                        <MenuItem value={5}>5 ngày</MenuItem>
                        <MenuItem value={10}>10 ngày</MenuItem>
                        <MenuItem value={15}>15 ngày</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Ghi chú
                    </Typography>
                    <textarea
                      style={{
                        width: "100%",
                        height: 100,
                        borderRadius: 8,
                        backgroundColor: "white",
                        color: "black",
                      }}
                      placeholder="Ghi chú"
                      value={newTaskData.description}
                      onChange={(e) =>
                        setNewTaskData({
                          ...newTaskData,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                  </Box>
                </Box>
              ) : tasks.length > 0 ? (
                tasks.map((task) => {
                  let borderColor = "#4caf50"; // Default: Hoàn thành
                  let priority = "Trung bình"; // Default priority

                  if (task.status === "Đang làm") {
                    borderColor = "#ff9800"; // Orange for "Đang làm"
                    priority = "Cao";
                  } else if (task.status === "Quá hạn") {
                    borderColor = "#f44336"; // Red for "Quá hạn"
                    priority = "Rất cao";
                  }

                  return (
                    <Box
                      key={`task-${task.user_id}${task.title}`}
                      sx={{
                        mb: 2,
                        p: 2,
                        border: `1px solid ${borderColor}`,
                        borderRadius: "8px",
                        bgcolor: "#f9f9f9",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        cursor: "pointer", // Add pointer cursor to indicate clickability
                      }}
                      onClick={() => handleTaskClick(task)}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            bgcolor: borderColor,
                            borderRadius: "50%",
                          }}
                        ></Box>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color={borderColor}
                        >
                          {task.status}
                        </Typography>
                        <Chip
                          label={task.subject}
                          size="small"
                          sx={{
                            bgcolor: "#e8f5e9",
                            color: borderColor,
                            fontWeight: "bold",
                          }}
                        />
                        <NotificationsIcon
                          sx={{ color: borderColor, fontSize: 18 }}
                        />
                      </Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {task.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ghi chú: {task.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <StarBorderIcon sx={{ fontSize: 16 }} /> Mức độ ưu tiên:{" "}
                        {priority}
                      </Typography>
                    </Box>
                  );
                })
              ) : (
                <></>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  bgcolor: isAddingTask ? "#e74c3c" : "#2c3e50",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: "medium",
                  width: "80%",
                  "&:hover": {
                    bgcolor: isAddingTask ? "#c0392b" : "#34495e",
                  },
                }}
                onClick={isAddingTask ? handleSaveTask : handleAddTask}
              >
                {isAddingTask ? "Lưu bài tập" : "Thêm bài tập"}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAddDialog;
