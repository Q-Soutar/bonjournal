import logo from "./logo.svg";
import "./App.css";
import { useContext, useEffect, useState } from "react";
import { getNewToken } from "./Utils/Auth";
import { storeToken } from "./Utils/Cookies";
import {
    dbInitEntries,
    dbCreateEntry,
    dbDeleteEntry,
    dbUpdateEntry
} from "./Utils/Database";
import { v4 as uuid } from "uuid";
import Timeline from "./Components/Timeline/Timeline";
import EntryCard from "./Components/EntryCard/EntryCard";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate
} from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import About from "./Pages/About";
import { initAuth } from "./Utils/Auth";
import AuthContext from "./Context/AuthContext";

const GMAP_API_KEY = "";
const GC_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?";
const GC_RESULT_TYPE = "country|sublocality|administrative_area_level_1";

const email = "stratton.soutar@gmail.com";
const password = "test456";

/*
    Concept for managing the props and callbacks:
        Do PFAs on the DB calls, embedding the different callbacks into those functions from the outset, and then completing the calls with the requisite data later on? Need to see how the structure shapes up before knowing if that will make sense. 
        Another idea could be passing down the whole-ass timeline from the top level downwards. 
 */
function App() {
    // const authCtx = useContext(AuthContext);

    // const isLoggedIn = !!authCtx.token;
    // useEffect(, [])

    // const initApp = function () {
    //     getNewToken(email, password)
    //         .then((tokenData) => {
    //             if (tokenData.token) {
    //                 setAuth({ ...tokenData });
    //                 storeToken(tokenData);
    //                 dbInitEntries(
    //                     tokenData.userID,
    //                     tokenData.token,
    //                     setEntries
    //                 );
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             setAuth({});
    //         });
    // };

    // useEffect(initApp, []);

    return (
        // <AuthContext.Provider>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/*" element={<Login />} />
            </Routes>
        </Router>
        // </AuthContext.Provider>
    );
}

export default App;
