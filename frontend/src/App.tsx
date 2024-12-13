import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./components/ChatPage";
import HomePage from "./components/Homepage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat/:roomId" element={<ChatPage />} />
      </Routes>
    </Router>
  );
};

export default App;
