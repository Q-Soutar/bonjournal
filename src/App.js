import logo from "./logo.svg";
import "./App.css";
import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AuthContext from "./Context/AuthContext";
import { themeOptions } from "./Utils/MaterialTheme";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TopBar from "./Components/TopBar/TopBar";
// import ThemeProvider from "@mui/system";

export const theme = createTheme(themeOptions);

function App() {
    return (
        // <AuthContext.Provider>
        <ThemeProvider theme={theme}>
            <TopBar />
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/*" element={<Login />} />
                </Routes>
            </Router>
        </ThemeProvider>
        // </AuthContext.Provider>
    );
}

export default App;
