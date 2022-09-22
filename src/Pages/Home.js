// import logo from "./logo.svg";
import { useContext, useEffect, useState } from "react";
import {
    dbInitEntries,
    dbCreateEntry,
    dbDeleteEntry,
    dbUpdateEntry,
    dbCreateTag,
    dbTagWrite
} from "../Utils/Database";
// import { v4 as uuid } from "uuid";
import { nanoid as uuid } from "nanoid";
import Timeline from ".././Components/Timeline/Timeline";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
// import { dbInitTags } from "../Utils/DatabaseTags";
import { dbInitTags } from "../Utils/DatabaseTags.js";

const GMAP_API_KEY = "";
const GC_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?";
const GC_RESULT_TYPE = "country|sublocality|administrative_area_level_1";

/*
    Concept for managing the props and callbacks:
        Do PFAs on the DB calls, embedding the different callbacks into those functions from the outset, and then completing the calls with the requisite data later on? Need to see how the structure shapes up before knowing if that will make sense. 
        Another idea could be passing down the whole-ass timeline from the top level downwards. 
 */
function Home() {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [tags, setTags] = useState([]);
    const [createEntryMode, setCreateEntryMode] = useState(false);
    const authCtx = useContext(AuthContext);

    const createEntryToggle = function () {
        setCreateEntryMode(!createEntryMode);
    };
    const timelineInit = function (entries) {
        setEntries(entries);
        document.getElementById("end").scrollIntoView();
    };

    // const isLoggedIn = !!authCtx.token;

    const createEntryHandler = function (newEntry) {
        // e.preventDefault();
        // console.log();
        newEntry.uuid = uuid();
        newEntry.date = Date.now();
        setLocation()
            .then((pos) => {
                // console.log(
                //     `<Home/> -> createEntryHandler() -> setLocation().then() -> Location received`
                // );
                newEntry.location = {
                    lat: pos.coords.latitude,
                    long: pos.coords.longitude
                };
                // console.log(
                //     `<Home/> -> createEntryHandler() -> setLocation().then() -> Location set`
                // );
                // console.log(
                //     `<Home/> -> createEntryHandler() -> setLocation().then() -> Sending new entry to DB`
                // );
                dbCreateEntry(
                    newEntry,
                    authCtx.userID,
                    authCtx.token,
                    setEntries,
                    dbInitEntries
                );
                console.log(`<Home/> -> createEntryHandler() -> newEntry:`);
                console.dir(newEntry);
                dbTagWrite(
                    newEntry.tags,
                    tags,
                    newEntry.uuid,
                    authCtx.userID,
                    authCtx.token
                ).then(() => {
                    dbInitTags(authCtx.token, authCtx.userID)
                        .then((tags) => {
                            setTags(tags);
                        })
                        .catch((err) => console.error(err));
                });
                // newEntry.tags.forEach((tag) => {
                //     dbCreateTag(
                //         tag,
                //         newEntry.uuid,
                //         authCtx.userID,
                //         authCtx.token
                //     );
                // });
                // console.log(
                //     `<Home/> -> createEntryHandler() -> setLocation().then() -> DB call initiated, reverting createEntryMode state`
                // );
                createEntryToggle();
            })
            .catch((err) => console.log(err));
    };

    const setLocation = function () {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };

    const revGeocode = function (newEntry = {}, callback) {
        const geoCallURL = `${GC_BASE_URL}latlng=${newEntry.location.lat},${
            newEntry.location.long
        }&key=${GMAP_API_KEY}&result_type=${encodeURIComponent(
            GC_RESULT_TYPE
        )}`;
        let completeEntry = { ...newEntry };
        // Reverse Geocoding -- API call
        fetch(geoCallURL)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.results.length > 0) {
                    return data;
                }
                if (data.results.length === 0) {
                    throw new Error({
                        errorMessage: data.error_message,
                        completeEntry: completeEntry
                    });
                }
            })
            .catch(() => {
                callback(completeEntry);
            });
    };

    const editEntryHandler = function (editedEntry) {
        // Identify altered fields, exclude the rest
        console.log(`<Home/> -> editEntryHandler() -> function called`);
        console.log(`<Home/> -> editEntryHandler() -> editedEntry: `);
        console.log(editedEntry);
        const oldEntry = entries.find(
            (entry) => entry.uuid === editedEntry.uuid
        );
        let entryUpdates = { uuid: editedEntry.uuid };
        let textUpdates = false;
        let tagUpdates = false;
        if (oldEntry.text !== editedEntry.text) {
            entryUpdates.text = editedEntry.text;
            textUpdates = true;
        }
        if (!tagsCompare(oldEntry.tags, editedEntry.tags)) {
            entryUpdates.tags = editedEntry.tags;
            tagUpdates = true;
        }
        if (textUpdates || tagUpdates) {
            dbUpdateEntry(
                entryUpdates,
                authCtx.userID,
                authCtx.token,
                setEntries,
                dbInitEntries
            );
        }
    };

    const tagsCompare = function (tags1, tags2) {
        if (tags1.length !== tags2.length) {
            return false;
        }
        const sharedTags = tags1.filter((tag) => {
            return tags2.indexOf(tag) > -1;
        });
        if (
            sharedTags.length !== tags2.length ||
            sharedTags.length !== tags1.length
        ) {
            return false;
        }
        return true;
    };

    const deleteEntryHandler = function (entryID) {
        console.log(`<Home/> -> deleteEntryHandler() -> function called`);
        dbDeleteEntry(
            authCtx.userID,
            authCtx.token,
            entryID,
            setEntries,
            dbInitEntries
        );
    };

    const logoutHandler = function () {
        authCtx.signOut();
        navigate("/");
    };

    const initApp = function () {
        // Need to normalize DB call params pattern
        dbInitEntries(authCtx.userID, authCtx.token, timelineInit);
        dbInitTags(authCtx.token, authCtx.userID)
            .then((tags) => {
                console.log(
                    `<Home> -> initApp() -> dbInitTags().then() -> tags: `
                );
                console.dir(tags);
                setTags(tags);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        if (authCtx.token) initApp();
        if (!authCtx.token) navigate("/");
        document.getElementById("end").scrollIntoView();
    }, []);

    return (
        <div>
            <Timeline
                entries={entries}
                tags={tags}
                deleteEntry={deleteEntryHandler}
                editEntry={editEntryHandler}
                createEntryMode={createEntryMode}
                createEntryHandler={createEntryHandler}
                createEntryToggle={createEntryToggle}
                setCreateMode={setCreateEntryMode}
            />
            <Box>
                {tags.map((tag) => {
                    return (
                        <p key={tag.uuid}>
                            {JSON.stringify(tag)}
                            <br></br>
                        </p>
                    );
                })}
            </Box>
        </div>
    );
}

export default Home;
