import { Route, Routes } from "react-router-dom";
import LoginView from "./views/login/LoginView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginView />} />
    </Routes>
  );
}

export default App;
