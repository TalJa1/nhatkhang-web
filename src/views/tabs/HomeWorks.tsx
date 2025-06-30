import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import TaskAPI from "../../api/taskAPI";
import HeaderSearchBar from "../../components/HeaderSearchBar";
import { format } from "date-fns";
import type { Task, TaskData } from "../../models/tabs/taskModel";
import ControlBarMui from "../../components/task/ControlBarMui";

const HomeWorks = () => {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    subject: "",
    priority: "",
    status: "",
  });

  const [loggedInUserName, setLoggedInUserName] = useState("Nguyên");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setLoggedInUserName(parsedData.displayName ?? "Nguyên");
      if (parsedData.photoURL) {
        setAvatarUrl(parsedData.photoURL);
      }
    }
  }, []);

  const pageSize = 10;
  const fetchTasks = async () => {
    try {
      const skip = (page - 1) * pageSize;
      const limit = pageSize;
      const response: Task = await TaskAPI.getTasks({
        skip,
        limit,
        filters,
      });
      if (
        response.data &&
        typeof response.pagination.total_pages === "number"
      ) {
        setTasks(response.data);
        setTotalPages(response.pagination.total_pages);
      } else {
        setTasks(Array.isArray(response) ? response : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  const handleFilterChange = (newFilters: {
    subject: string;
    priority: string;
    status: string;
  }) => {
    setPage(1);
    setFilters(newFilters);
  };

  // Data is already filtered and paged from the server
  const filteredTasks = tasks;

  const HomeWorksContent = () => {
    // Dialog state for reminder switch and notification days
    const [reminder, setReminder] = useState(true);
    const [notifyBefore, setNotifyBefore] = useState(2);
    const getStatusChip = (status: string) => {
      switch (status) {
        case "Hoàn thành":
          return <Chip label="Hoàn thành" color="success" />;
        case "Đang làm":
          return <Chip label="Đang làm" color="info" />;
        case "Quá hạn":
          return <Chip label="Quá hạn" color="error" />;
        default:
          return <Chip label={status} color="warning" />;
      }
    };

    const getPriorityLabel = (priority: number) => {
      switch (priority) {
        case 1:
          return "Thấp";
        case 2:
          return "Trung bình";
        case 3:
          return "Cao";
        default:
          return priority;
      }
    };

    const formatDate = (date: string) => {
      const parsedDate = new Date(date);
      return format(parsedDate, "MMMM d, yyyy");
    };

    return (
      <Box sx={{ width: "100%", overflowX: "hidden" }}>
        <HeaderSearchBar userName={loggedInUserName} />
        <ControlBarMui
          onFilterChange={handleFilterChange}
          onTaskAdded={() => fetchTasks()}
        />
        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ tableLayout: "fixed", minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F9F9F9" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Tiêu đề</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Môn</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Hạn</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Mức ưu tiên</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow
                    key={`${task.task_id}${task.title}${task.due_date}`}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedTask(task);
                      setDialogOpen(true);
                    }}
                  >
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.subject}</TableCell>
                    <TableCell>{formatDate(task.due_date)}</TableCell>
                    <TableCell>{getPriorityLabel(task.priority)}</TableCell>
                    <TableCell>{getStatusChip(task.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#256A6A",
                  borderColor: "#256A6A",
                },
                "& .Mui-selected": {
                  backgroundColor: "black",
                  color: "#fff",
                },
                "& .MuiPaginationItem-root.Mui-selected:hover": {
                  backgroundColor: "#256A6A",
                },
                "& .MuiPaginationItem-root:hover": {
                  backgroundColor: "#e0f2f1",
                },
              }}
            />
          </Box>
        </Box>

        {/* Task Detail Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          {selectedTask && (
            <>
              <DialogTitle
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  pb: 0,
                }}
              >
                <Avatar
                  src={avatarUrl || undefined}
                  sx={{ width: 64, height: 64, mb: 1 }}
                >
                  {loggedInUserName[0]}
                </Avatar>
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    {selectedTask.title}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", textAlign: "center", mt: 1 }}
                >
                  Sắp đến hạn nộp bài tập rồi, hãy tập trung hoàn thành nào!
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Chip
                    label={
                      selectedTask.status === "Đang làm"
                        ? "Đang làm"
                        : selectedTask.status
                    }
                    color={
                      selectedTask.status === "Đang làm"
                        ? "info"
                        : selectedTask.status === "Hoàn thành"
                        ? "success"
                        : selectedTask.status === "Quá hạn"
                        ? "error"
                        : "warning"
                    }
                    sx={{ mr: 1, pointerEvents: "none", userSelect: "none" }}
                  />
                  <Typography color="error" fontWeight="bold">
                    {(() => {
                      // Calculate days left
                      const due = new Date(selectedTask.due_date);
                      const now = new Date();
                      const diff = Math.ceil(
                        (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                      );
                      return diff > 0
                        ? `Còn ${diff} ngày!`
                        : diff === 0
                        ? "Hôm nay!"
                        : `Đã quá hạn!`;
                    })()}
                  </Typography>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box
                  sx={{
                    mt: 2,
                    mb: 2,
                    p: 2,
                    border: "1px solid #eee",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Ngày{" "}
                    {format(new Date(selectedTask.due_date), "d MMMM yyyy")}
                  </Typography>
                  <Box
                    sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}
                  >
                    <Typography sx={{ fontWeight: "bold", mr: 2 }}>
                      Mức độ ưu tiên:
                    </Typography>
                    <Button
                      variant={
                        selectedTask.priority === 3 ? "contained" : "outlined"
                      }
                      sx={{
                        mr: 1,
                        minWidth: 80,
                        backgroundColor:
                          selectedTask.priority === 3 ? "#256A6A" : undefined,
                        color: selectedTask.priority === 3 ? "#fff" : undefined,
                        fontSize: 10,
                      }}
                      disabled
                    >
                      <span style={{ fontSize: 10 }}>Cao</span>
                    </Button>
                    <Button
                      variant={
                        selectedTask.priority === 2 ? "contained" : "outlined"
                      }
                      sx={{
                        mr: 1,
                        minWidth: 80,
                        backgroundColor:
                          selectedTask.priority === 2 ? "#256A6A" : undefined,
                        color: selectedTask.priority === 2 ? "#fff" : undefined,
                        fontSize: 10,
                      }}
                      disabled
                    >
                      <span style={{ fontSize: 10 }}>Trung bình</span>
                    </Button>
                    <Button
                      variant={
                        selectedTask.priority === 1 ? "contained" : "outlined"
                      }
                      sx={{
                        minWidth: 80,
                        backgroundColor:
                          selectedTask.priority === 1 ? "#256A6A" : undefined,
                        color: selectedTask.priority === 1 ? "#fff" : undefined,
                        fontSize: 10,
                      }}
                      disabled
                    >
                      <span style={{ fontSize: 10 }}>Thấp</span>
                    </Button>
                    <FormControl
                      sx={{ ml: 3, minWidth: 120 }}
                      size="small"
                      disabled
                    >
                      <InputLabel id="subject-label">Chọn môn</InputLabel>
                      <Select
                        labelId="subject-label"
                        value={selectedTask.subject}
                        label="Chọn môn"
                        disabled
                      >
                        <MenuItem value={selectedTask.subject}>
                          {selectedTask.subject}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Typography sx={{ fontWeight: "bold", mr: 2 }}>
                      Nhắc nhở
                    </Typography>
                    <Switch
                      checked={reminder}
                      disabled
                      onClick={() => {
                        setReminder(!reminder);
                      }}
                    />
                    <Typography sx={{ ml: 2, mr: 1 }}>
                      Thông báo trước hạn nộp
                    </Typography>
                    <Select
                      value={notifyBefore}
                      size="small"
                      sx={{ minWidth: 80 }}
                      disabled
                      onChange={(e) => setNotifyBefore(Number(e.target.value))}
                    >
                      <MenuItem value={1}>1 ngày</MenuItem>
                      <MenuItem value={2}>2 ngày</MenuItem>
                      <MenuItem value={3}>3 ngày</MenuItem>
                    </Select>
                  </Box>
                  <TextField
                    label="Ghi chú"
                    multiline
                    minRows={3}
                    value={selectedTask.description || "Không có ghi chú"}
                    fullWidth
                    sx={{ mt: 2 }}
                    InputProps={{ readOnly: true, disabled: true }}
                  />
                </Box>
              </DialogContent>
              <DialogActions
                sx={{ justifyContent: "space-between", px: 3, pb: 2 }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setDialogOpen(false)}
                >
                  Xóa
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={async () => {
                    if (selectedTask) {
                      try {
                        await TaskAPI.updateTask(selectedTask.task_id, {
                          user_id: selectedTask.user_id,
                          title: selectedTask.title,
                          subject: selectedTask.subject,
                          due_date: selectedTask.due_date,
                          priority: selectedTask.priority,
                          status: "Hoàn thành",
                          description: selectedTask.description || "",
                        });
                        fetchTasks();
                      } catch (error) {
                        console.error("Error updating task status:", error);
                      }
                    }
                    setDialogOpen(false);
                  }}
                >
                  Hoàn thành
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    );
  };

  return <Sidebar children={<HomeWorksContent />} />;
};

export default HomeWorks;
