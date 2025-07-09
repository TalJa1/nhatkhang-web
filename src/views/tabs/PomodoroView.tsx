import { Box } from "@mui/material";
import Sidebar from "../../components/Sidebar";

const PomodoroView = () => {
  const PromodoroMain = () => {
    return <Box></Box>;
  };

  return <Sidebar children={<PromodoroMain />} />;
};

export default PomodoroView;
