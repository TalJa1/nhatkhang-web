import React from "react";
import Sidebar from "../../components/Sidebar";
import { Box, Paper, InputBase, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const QAView = () => {
  // Get user name from localStorage
  const userName = (() => {
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.displayName || "Bạn";
      }
    } catch {
      // ignore
    }
    return "Bạn";
  })();

  const QAViewContent = () => {
    // State for user input and loading
    const [input, setInput] = React.useState("");
    const [messages, setMessages] = React.useState([
      { sender: "ai", text: `Xin chào ${userName}! Tôi là SSP AI, bạn cần hỏi gì?` },
    ]);
    const [loading, setLoading] = React.useState(false);

    // Handler for sending message
    const handleSend = () => {
      if (!input.trim()) return;
      setMessages((msgs) => [
        ...msgs,
        { sender: "user", text: input },
      ]);
      setInput("");
      setLoading(true);
      // Simulate AI response loading
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { sender: "ai", text: "(Đang phát triển: SSP AI sẽ trả lời tại đây...)" },
        ]);
        setLoading(false);
      }, 1800);
    };

    // Enter key to send
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !loading) handleSend();
    };

    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", background: "#F5F7FA" }}>
        <Box sx={{ flex: 1, overflowY: "auto", px: { xs: 1, md: 8 }, py: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                mb: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 3,
                  background: msg.sender === "user" ? "#4F8CFF" : msg.sender === "ai" ? "#256A6A" : "#fff",
                  color: msg.sender === "user" ? "#fff" : msg.sender === "ai" ? "#fff" : "#222",
                  fontSize: 16,
                  boxShadow: msg.sender === "user" ? "0 2px 8px #4F8CFF33" : msg.sender === "ai" ? "0 2px 8px #256A6A55" : "0 2px 8px #256A6A22",
                }}
              >
                {msg.text}
              </Paper>
            </Box>
          ))}
          {loading && (
            <Box sx={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Paper elevation={3} sx={{ px: 2, py: 1.5, borderRadius: 3, background: "#fff", color: "#222", fontSize: 16 }}>
                <span style={{ opacity: 0.7 }}>Đang chờ SSP AI trả lời...</span>
              </Paper>
              <Box sx={{ width: 18, height: 18, ml: 1 }}>
                <span className="dot-flashing" style={{ display: "inline-block", width: 18, height: 18 }}></span>
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={{ width: "100%", px: { xs: 1, md: 8 }, pb: 3 }}>
          <Paper
            elevation={6}
            sx={{
              background: "#256A6A",
              borderRadius: 3,
              px: 3,
              pt: 1.5,
              pb: 1.5,
              width: "100%",
              boxShadow: "0 4px 24px #256A6A",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <InputBase
              placeholder="Hỏi SSP AI..."
              sx={{
                flex: 1,
                color: "#fff",
                fontSize: 17,
                px: 0,
                background: "transparent",
              }}
              inputProps={{ "aria-label": "Hỏi SSP AI" }}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              autoFocus
            />
            <IconButton sx={{ color: loading ? "#B0B0B0" : "#fff", ml: 1 }} onClick={handleSend} disabled={loading || !input.trim()}>
              <SendIcon fontSize="medium" color="action"/>
            </IconButton>
          </Paper>
        </Box>
        {/* Loading animation style */}
        <style>{`
          .dot-flashing {
            position: relative;
            width: 18px;
            height: 18px;
          }
          .dot-flashing::before, .dot-flashing::after, .dot-flashing {
            content: '';
            display: inline-block;
            position: absolute;
            top: 0;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #256A6A;
            animation: dotFlashing 1s infinite linear alternate;
          }
          .dot-flashing::before {
            left: 0;
            animation-delay: 0s;
          }
          .dot-flashing {
            left: 6px;
            animation-delay: 0.3s;
          }
          .dot-flashing::after {
            left: 12px;
            animation-delay: 0.6s;
          }
          @keyframes dotFlashing {
            0% { opacity: 0.2; }
            50%, 100% { opacity: 1; }
          }
        `}</style>
      </Box>
    );
  };

  return <Sidebar children={<QAViewContent />} />;
};

export default QAView;
