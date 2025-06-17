import { Box, Typography, Divider } from "@mui/material";
import TodoItem from "./TodoItem"; // Adjust path
import ScheduleItem from "./ScheduleItem"; // Adjust path
import { mockTodoItems, mockScheduleItems } from "../../services/home/learningService"; // Adjust path

const DardboardWidgets = () => {
  return (
    <Box sx={{ mt: 3, maxWidth: "500px", width: "100%" }}>
      {" "}
      {/* Margin top, control width */}
      {/* To-Do Section */}
      <Box sx={{ mb: 3 }}>
        {" "}
        {/* Margin bottom */}
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Việc cần làm
        </Typography>
        {mockTodoItems.map((item) => (
          <TodoItem key={item.id} item={item} />
        ))}
      </Box>
      <Divider sx={{ my: 2 }} /> {/* Divider between sections */}
      {/* Upcoming Schedule Section */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Lịch học sắp tới
        </Typography>
        {mockScheduleItems.map((item) => (
          <ScheduleItem key={item.id} item={item} />
        ))}
      </Box>
    </Box>
  );
};

export default DardboardWidgets;
