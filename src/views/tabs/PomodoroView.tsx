import React, { useState, useRef, useEffect } from "react";
import relaxingPiano from "../../assets/sound/relaxing_piano.mp3";
import rainSound from "../../assets/sound/rain_sound.mp3"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
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
  // Audio Player State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(() => {
    const stored = localStorage.getItem('pomodoro_audio_volume');
    return stored ? Number(stored) : 1;
  });
  const [audioSrc, setAudioSrc] = useState(relaxingPiano);
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  // Audio Player Handlers
  const handleAudioPlayPause = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleAudioVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAudioVolume(value);
    localStorage.setItem('pomodoro_audio_volume', value.toString());
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleSoundSelect = (src: string) => {
    setAudioSrc(src);
    setIsAudioPlaying(false);
    handleMenuClose();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // Remove unused progress and duration listeners
    audio.addEventListener("ended", () => setIsAudioPlaying(false));
    audio.volume = audioVolume;
    return () => {
      audio.removeEventListener("ended", () => setIsAudioPlaying(false));
    };
    // eslint-disable-next-line
  }, []);

  // Keep volume in sync if changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume;
    }
  }, [audioVolume]);

  // Sync play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isAudioPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isAudioPlaying]);

  // Removed unused handleAudioChange

  // Removed unused formatAudioTime
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

        {/* Audio Player */}
        <Box
          width={340}
          display="flex"
          flexDirection="column"
          alignItems="center"
          mb={3}
          bgcolor="#f8fafc"
          borderRadius={3}
          boxShadow="0 2px 8px #e0e7ef"
          py={2}
        >
          <audio
            ref={audioRef}
            src={audioSrc}
            preload="auto"
            loop
            onPlay={() => setIsAudioPlaying(true)}
            onPause={() => setIsAudioPlaying(false)}
            style={{ display: "none" }}
          />
          <Box display="flex" alignItems="center" width="100%" justifyContent="center">
            <IconButton
              onClick={handleAudioPlayPause}
              sx={{
                width: 60,
                height: 60,
                mb: 1,
                bgcolor: "#fff",
                boxShadow: "0 2px 8px #e0e7ef",
              }}
            >
              {isAudioPlaying ? (
                <PauseCircleIcon sx={{ fontSize: 36 }} />
              ) : (
                <PlayArrowIcon sx={{ fontSize: 36 }} />
              )}
            </IconButton>
            <IconButton
              onClick={handleMenuOpen}
              sx={{ ml: 1, mb: 1 }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleSoundSelect(relaxingPiano)} selected={audioSrc === relaxingPiano}>
                Nhạc Piano
              </MenuItem>
              <MenuItem onClick={() => handleSoundSelect(rainSound)} selected={audioSrc === rainSound}>
                Tiếng mưa
              </MenuItem>
            </Menu>
          </Box>
          <Box display="flex" alignItems="center" width="90%" mt={1}>
            <span style={{ fontSize: 14, minWidth: 40 }}>Âm lượng</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={audioVolume}
              onChange={handleAudioVolumeChange}
              style={{ flex: 1, margin: "0 8px" }}
            />
            <span style={{ fontSize: 14, minWidth: 32 }}>{Math.round(audioVolume * 100)}</span>
          </Box>
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
