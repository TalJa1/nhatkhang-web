import Sidebar from "../../components/Sidebar";
import { Box, Typography, Paper, InputBase, IconButton } from "@mui/material";
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
    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              background: "linear-gradient(90deg, #4F8CFF, #B16CEA, #FF5E69)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 8,
              textAlign: "center",
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Xin chào{" "}
            <Box component="span" sx={{ color: "#FF5E69", display: "inline" }}>
              {userName}!
            </Box>
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              background: "#256A6A",
              borderRadius: 3,
              px: 4,
              pt: 2,
              pb: 2,
              width: "100%",
              boxShadow: "0 4px 24px #256A6A",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <InputBase
                placeholder="Hỏi SSP AI"
                sx={{
                  flex: 1,
                  color: "#fff",
                  fontSize: 17,
                  px: 0,
                  background: "transparent",
                }}
                inputProps={{ "aria-label": "Hỏi SSP AI" }}
              />
              <IconButton sx={{ color: "#B0B0B0" }}>
                <SendIcon fontSize="medium" color="action"/>
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  };

  return <Sidebar children={<QAViewContent />} />;
};

export default QAView;
