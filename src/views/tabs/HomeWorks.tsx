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
} from "@mui/material";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import TaskAPI from "../../api/taskAPI";
import ControlBarMui from "../../components/task/ControlBarMui";
import HeaderSearchBar from "../../components/HeaderSearchBar";
import { format } from "date-fns";
import type { Task } from "../../models/tabs/taskModel";

const HomeWorks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState({
    subject: "",
    priority: "",
    status: "",
  });

  const [loggedInUserName, setLoggedInUserName] = useState("Nguyên");
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setLoggedInUserName(parsedData.displayName ?? "Nguyên");
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await TaskAPI.getTasks();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleFilterChange = (newFilters: {
    subject: string;
    priority: string;
    status: string;
  }) => {
    setFilters(newFilters);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSubject = !filters.subject || task.subject === filters.subject;
    const matchesPriority =
      !filters.priority || task.priority.toString() === filters.priority;
    const matchesStatus = !filters.status || task.status === filters.status;

    return matchesSubject && matchesPriority && matchesStatus;
  });

  const HomeWorksContent = () => {
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
        <ControlBarMui onFilterChange={handleFilterChange} />
        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ tableLayout: "fixed", minWidth: 650 }}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#F9F9F9",
                  }}
                >
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
        </Box>
      </Box>
    );
  };

  return <Sidebar children={<HomeWorksContent />} />;
};

export default HomeWorks;
