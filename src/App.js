// React
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Material UI
import { themeOptions } from "./Utils/MaterialTheme";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthProvider from "./Context/AuthProvider";
// App files
import "./App.css";
import { TopBar } from "./Components/TopBar/IndexTopBar";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Profile from "./Pages/Profile";
import SignUp from "./Pages/SignUp";

export const theme = createTheme(themeOptions);
// Set up top level auth context, react router, and pages
function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <AuthProvider>
                    <TopBar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route
                            path="/profile"
                            element={<Profile display="flex" />}
                        />
                        <Route path="/*" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
