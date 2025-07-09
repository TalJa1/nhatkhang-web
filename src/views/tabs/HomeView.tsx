// Animated progress circle component
import React from "react";

const AnimatedCircleProgress = ({ milestone, total }: { milestone: number; total: number }) => {
  const percent = milestone / total;
  const arcLength = 282;
  const targetOffset = arcLength - percent * arcLength;
  const minAngle = 135;
  const maxAngle = 45;
  const targetAngle = minAngle + (maxAngle - minAngle) * percent;
  const [offset, setOffset] = React.useState(arcLength);
  const [angle, setAngle] = React.useState(minAngle);
  React.useEffect(() => {
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    function animate(now: number) {
      const elapsed = Math.min(now - start, duration);
      const progress = elapsed / duration;
      setOffset(arcLength - (arcLength - targetOffset) * progress);
      setAngle(minAngle + (targetAngle - minAngle) * progress);
      if (elapsed < duration) {
        frame = requestAnimationFrame(animate);
      } else {
        setOffset(targetOffset);
        setAngle(targetAngle);
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [milestone, total, targetAngle, targetOffset]);
  // The arc is from 135deg (left) to 45deg (right), but SVG 0deg is at 3 o'clock and increases clockwise.
  // To match the arc, we need to convert angle to SVG coordinates:
  // 0deg (SVG) is at (cx+r, cy), 90deg is (cx, cy+r), 180deg is (cx-r, cy), 270deg is (cx, cy-r)
  // Our arc starts at 135deg (SVG), ends at 45deg (SVG)
  // So, angleSVG = angle (no flip needed, since 135deg is left, 45deg is right)
  const r = 50;
  const cx = 70, cy = 70;
  const angleSVG = angle;
  const rad = (angleSVG * Math.PI) / 180;
  const x2 = cx + r * Math.cos(rad);
  const y2 = cy + r * Math.sin(rad);
  return (
    <Box sx={{ position: "relative", width: 140, height: 140, mb: 1 }}>
      <svg width={140} height={140} viewBox="0 0 140 140">
        <path
          d="M 30 120 A 60 60 0 1 1 110 120"
          fill="none"
          stroke="#F8E7D9"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 30 120 A 60 60 0 1 1 110 120"
          fill="none"
          stroke="#F18C3B"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={offset}
          style={{ filter: "drop-shadow(0 2px 8px #F18C3B33)", transition: "stroke-dashoffset 0.2s" }}
        />
        <line
          x1={cx}
          y1={cy}
          x2={x2}
          y2={y2}
          stroke="#F18C3B"
          strokeWidth="5"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 2px 8px #F18C3B33)" }}
        />
        <circle cx={cx} cy={cy} r="10" fill="#fff" stroke="#F18C3B" strokeWidth="4" />
      </svg>
    </Box>
  );
};
import { Box, Grid } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import wavinghand from "../../assets/home/wavinghand.png";
import { useEffect, useState } from "react";
import BarChart from "../../components/BarChart";
// import progress from "../../assets/home/progress.png";
import { getLearningData } from "../../services/home/learningService";
import PercentProgress from "../../components/home/PercentProgress";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import avatar from "../../assets/home/avatar.png";
import MiniCalendar from "../../components/home/MiniCalendar";
import DardboardWidgets from "../../components/home/DardboardWidgets";
import type { UserStorageInterface } from "../../services/userStorageInterface";

const HomeView = () => {
  document.title = "Tổng quan";
  const [name, setName] = useState<string>("Nguyên");
  const [avatarImg, setAvatarImg] = useState<string>("");
  const learningData = getLearningData();

  // Set the name of the user from local storage using useEffect
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      const parsedData: UserStorageInterface = JSON.parse(storedData);
      setName(parsedData.displayName ?? "Nguyên");
      setAvatarImg(parsedData.photoURL ?? "");
    }
  }, []);

  const HomeContent = () => {
    return (
      <Box style={{ padding: "20px" }}>
        {/* Chart group */}
        <Grid container>
          <Grid size={{ xs: 12, sm: 12, md: 8 }}>
            <Box sx={{ m: 1 }}>
              <Box
                display="flex"
                alignItems="center"
                sx={{ color: "#256A6A", fontSize: "24px", fontWeight: "700" }}
              >
                Xin chào {name} <img src={wavinghand} width={30} />
              </Box>
              <Box sx={{ color: "#828282", fontSize: "14px" }}>
                Chúc bạn một tuần học tập hiệu quả!
              </Box>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: "10px" }}>
              <Grid size={7}>
                <Box
                  sx={{
                    color: "#256A6A",
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                >
                  Thời gian học
                </Box>
                <BarChart />
              </Grid>
              <Grid size={5}>
                <Box
                  sx={{
                    color: "#256A6A",
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                >
                  Hiệu suất
                </Box>
                <Box
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <AnimatedCircleProgress milestone={8} total={10} />
                  <Box display={"flex"} flexDirection={"row"} gap={1}>
                    <Box sx={{ fontSize: "14px", color: "#4F4F4F" }}>
                      Bài tập hoàn thành:
                    </Box>
                    <Box sx={{ fontSize: "14px", fontWeight: "700" }}>8/10</Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Data Group */}
            <Grid sx={{ mt: 5, width: "100%" }} container>
              <Box
                sx={{
                  color: "#256A6A",
                  fontSize: "20px",
                  fontWeight: 600,
                  width: "100%",
                }}
              >
                Lộ trình mục tiêu
              </Box>
              <Grid container sx={{ mt: 2, width: "100%" }}>
                <Grid container sx={{ width: "100%" }}>
                  <Grid
                    container
                    sx={{
                      color: "#84868A",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    <Grid size={2}>Môn</Grid>
                    <Grid size={2}>Mục tiêu</Grid>
                    <Grid size={2}>Tiến độ</Grid>
                    <Grid size={2}>BĐ</Grid>
                    <Grid size={2}>KT</Grid>
                    <Grid size={2}>Phân loại</Grid>
                  </Grid>
                </Grid>
                {learningData.map((item, index) => (
                  <Grid key={index} sx={{ width: "100%", mt: 3 }}>
                    <Grid
                      container
                      sx={{
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      <Grid
                        size={2}
                        sx={{ wordWrap: "break-word", fontWeight: 700 }}
                      >
                        {item.subject}
                      </Grid>
                      <Grid size={2} sx={{ wordWrap: "break-word" }}>
                        {item.goal}
                      </Grid>
                      <Grid size={2} sx={{ wordWrap: "break-word" }}>
                        <PercentProgress progress={parseInt(item.progress)} />
                      </Grid>
                      <Grid size={2} sx={{ wordWrap: "break-word" }}>
                        {item.startDate}
                      </Grid>
                      <Grid size={2} sx={{ wordWrap: "break-word" }}>
                        {item.endDate}
                      </Grid>
                      <Grid size={2} sx={{ wordWrap: "break-word" }}>
                        {item.category}
                      </Grid>
                    </Grid>
                    <Box
                      sx={{
                        mt: 1,
                        p: 2,
                        fontSize: "14px",
                        borderRadius: "8px",
                        backgroundColor:
                          Math.random() > 0.5 ? "#FFE4E4" : "#E1E2F6",
                      }}
                    >
                      <Box sx={{ fontWeight: "bold", mb: 1 }}>{item.title}</Box>
                      {item.description}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          {/* Right info */}
          <Grid
            size={{ xs: false, sm: false, md: 4 }}
            sx={{
              display: { xs: "none", sm: "none", md: "block" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <Box
                textAlign="left"
                color="#000000"
                sx={{ fontWeight: "700", fontSize: "24px" }}
              >
                Hồ sơ
              </Box>
              <EditSquareIcon
                sx={{
                  color: "#1C1E30",
                  fontSize: "24px",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{
                borderRadius: "50%",
                overflow: "hidden",
                width: "140px",
                height: "140px",
                mb: 2,
              }}>
                <img src={avatarImg ? avatarImg : avatar} width={140} />
              </Box>

              <Box
                sx={{
                  color: "#000000",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                {name}
              </Box>
              <br />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <MiniCalendar />
                <DardboardWidgets />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return <Sidebar children={<HomeContent />} />;
};

export default HomeView;
