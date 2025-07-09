import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Checkbox,
  TextField,
  IconButton,
} from "@mui/material";
import Sidebar from "../../components/Sidebar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const POMODORO_TIME = 20 * 60; // 20 minutes in seconds
const REST_TIME = 5 * 60; // 5 minutes in seconds
const LONG_REST_TIME = 15 * 60; // 15 minutes in seconds

interface Task {
  text: string;
  done: boolean;
}

const PromodoroMain = () => {
  const [tab, setTab] = useState(0);
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [restCount, setRestCount] = useState(0);
  const [longRestCount, setLongRestCount] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      if (tab === 0) setPomodoroCount((c) => c + 1);
      if (tab === 1) setRestCount((c) => c + 1);
      if (tab === 2) setLongRestCount((c) => c + 1);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, timeLeft, tab]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setIsRunning(false);
    if (newValue === 0) setTimeLeft(POMODORO_TIME);
    if (newValue === 1) setTimeLeft(REST_TIME);
    if (newValue === 2) setTimeLeft(LONG_REST_TIME);
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);

  const handleTaskAdd = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, done: false }]);
      setNewTask("");
    }
  };

  const handleTaskToggle = (idx: number) => {
    setTasks(tasks.map((t, i) => (i === idx ? { ...t, done: !t.done } : t)));
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <Box display="flex" bgcolor="#fff" overflow="hidden">
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        pt={6}
      >
        <Typography variant="h6" fontWeight={700} mb={2} textAlign="center">
          Tại sao bạn không thử thách bản thân?{" "}
          <span role="img" aria-label="smile">
            🥱
          </span>
        </Typography>
        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab
            label={
              <Box display="flex" alignItems="center">
                Pomodoro{" "}
                <Typography ml={0.5} color="#256A6A" fontWeight={700}>
                  {pomodoroCount}{" "}
                </Typography>
              </Box>
            }
          />
          <Tab
            label={
              <Box display="flex" alignItems="center">
                Nghỉ ngắn{" "}
                <Typography ml={0.5} color="#256A6A" fontWeight={700}>
                  {restCount}{" "}
                </Typography>
              </Box>
            }
          />
          <Tab
            label={
              <Box display="flex" alignItems="center">
                Nghỉ dài{" "}
                <Typography ml={0.5} color="#256A6A" fontWeight={700}>
                  {longRestCount}{" "}
                </Typography>
              </Box>
            }
          />
        </Tabs>
        <Box
          width={340}
          height={340}
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={2}
        >
          <CircularProgressbar
            strokeWidth={5}
            value={
              tab === 0
                ? (timeLeft / POMODORO_TIME) * 100
                : tab === 1
                ? (timeLeft / REST_TIME) * 100
                : (timeLeft / LONG_REST_TIME) * 100
            }
            text={formatTime(timeLeft)}
            styles={buildStyles({
              textColor: "#256A6A",
              pathColor: "#256A6A",
              trailColor: "#e0e7ef",
              textSize: "30px",
              strokeLinecap: "round",
            })}
          />
        </Box>
        <Typography variant="subtitle2" color="#256A6A" fontWeight={700} mb={1}>
          Cấp độ
        </Typography>
        <Typography variant="subtitle1" fontWeight={700} mb={3}>
          Phổ biến
        </Typography>
        <Button
          variant="contained"
          sx={{
            width: 340,
            height: 60,
            borderRadius: 8,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 2,
            boxShadow: "0 8px 24px #256A6A22",
            bgcolor: "#256A6A",
            "&:hover": { bgcolor: "#256A6A" },
          }}
          onClick={isRunning ? handlePause : handleStart}
        >
          {isRunning ? "TẠM DỪNG" : "BẮT ĐẦU"}
        </Button>
      </Box>
      {/* Tasks Section */}
      <Box
        width="420px"
        borderLeft="1px solid #e5e7eb"
        bgcolor="#fff"
        px={3}
        py={2}
        display="flex"
        flexDirection="column"
        position="relative"
        height="100%"
        overflow="hidden"
      >
        <Typography variant="h5" fontWeight={700} mb={1}>
          Công việc <span style={{ fontWeight: 400 }}>{tasks.length}</span>
        </Typography>
        <Box flex={1} minHeight={0} overflow="auto">
          {tasks.map((task, idx) => (
            <Paper
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                p: 1,
                borderRadius: 2,
                boxShadow: "0 2px 8px #e0e7ef",
              }}
            >
              <Checkbox
                checked={task.done}
                onChange={() => handleTaskToggle(idx)}
              />
              <Typography
                sx={{
                  textDecoration: task.done ? "line-through" : "none",
                  flex: 1,
                }}
              >
                {task.text}
              </Typography>
              <IconButton
                onClick={() => setTasks(tasks.filter((_, i) => i !== idx))}
                size="small"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 6L14 14M6 14L14 6"
                    stroke="#256A6A"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </IconButton>
            </Paper>
          ))}
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 1,
              p: 1.5,
              borderRadius: 2,
              border: "1.5px dashed #e0e7ef",
              boxShadow: "none",
              cursor: "pointer",
            }}
            elevation={0}
          >
            <TextField
              variant="standard"
              placeholder="Thêm công việc khác"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTaskAdd();
              }}
              sx={{ flex: 1, ml: 1, fontSize: 16 }}
              InputProps={{ disableUnderline: true }}
            />
            <IconButton onClick={handleTaskAdd} size="small" sx={{ ml: 1 }}>
              <span style={{ fontSize: 20, color: "#256A6A" }}>+</span>
            </IconButton>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

const PomodoroView = () => {
  return <Sidebar children={<PromodoroMain />} />;
};

export default PomodoroView;
