import { Route, Routes } from "react-router-dom";
import LoginView from "./views/login/LoginView";
import HomeView from "./views/tabs/HomeView";
import ScheduleView from "./views/tabs/ScheduleView";
import HomeWorks from "./views/tabs/HomeWorks";
import QAView from "./views/tabs/QAView";
import PomodoroView from "./views/tabs/PomodoroView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginView />} />
      <Route path="/home" element={<HomeView />} />
      <Route path="/schedule" element={<ScheduleView />} />
      <Route path="/homeworks" element={<HomeWorks />} />
      <Route path="/qa" element={<QAView />} />
      <Route path="/pomodoro" element={<PomodoroView />} />
    </Routes>
  );
}

export default App;
