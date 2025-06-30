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
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setLoggedInUserName(parsedData.displayName ?? "Nguyên");
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
                  backgroundColor: "#256A6A",
                  color: "#fff",
                },
                "& .MuiPaginationItem-root.Mui-selected:hover": {
                  backgroundColor: "#1e5555",
                },
                "& .MuiPaginationItem-root:hover": {
                  backgroundColor: "#e0f2f1",
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  };

  return <Sidebar children={<HomeWorksContent />} />;
};

export default HomeWorks;
