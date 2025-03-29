import "./App.css";
import Login from "./components/login/Login.tsx";
import Sign from "./components/signUp/sign.tsx";
import Dashboard from "./components/dashboard/Dashboard.tsx";
import ResetPass from "./components/resetPass/ResetPass.tsx";
import Profile from "./components/Profile/Profile.tsx";
import Post from "./components/Post/Post.tsx";
import Search from "./components/Search/Search.tsx";
import Home from "./components/Home/Home.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sign" element={<Sign />} />
          <Route path="/reset-pass" element={<ResetPass />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="home" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="post" element={<Post />} />
            <Route path="Search" element={<Search />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
