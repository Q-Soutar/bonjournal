// React
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Material UI
import { Box } from "@mui/material";

// NPM
import { nanoid } from "nanoid";

// App files
import { Timeline } from ".././Components/Timeline/IndexTimeline";
// import logo from "./logo.svg";
import {
    dbInitEntries,
    dbCreateEntry,
    dbDeleteEntry,
    dbUpdateEntry
} from "../Utils/DatabaseEntries";
import AuthContext from "../Context/AuthContext";
import { dbInitTags, dbTagWrite } from "../Utils/DatabaseTags.js";
import { GMAP_API_KEY, GC_BASE_URL, GC_RESULT_TYPE } from "../Utils/Config";

const tagDebug = false;

// Main page for the app. Handles *a lot* of the state across the app.
function Home() {
    // State & friends
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [tags, setTags] = useState([]);
    const [createEntryMode, setCreateEntryMode] = useState(false);
    const authCtx = useContext(AuthContext);

    // Toggle the form for new entries
    const createEntryToggle = function () {
        setCreateEntryMode(!createEntryMode);
    };
    // Load the entries
    const timelineInit = function (entries) {
        setEntries(entries);
        document.getElementById("end").scrollIntoView();
    };

    // Spin the app state up
    const initApp = function () {
        // Grab the entries
        dbInitEntries(authCtx.userID, authCtx.token, timelineInit);
        // Grab those tags
        dbInitTags(authCtx.token, authCtx.userID)
            .then((tags) => {
                setTags(tags);
            })
            .catch((err) => console.error(err));
    };

    // Receive form data and write it to the database before refreshing the timeline.
    const createEntryHandler = function (newEntry) {
        // Fill in some other data
        newEntry.uuid = nanoid();
        newEntry.date = Date.now();
        setLocation()
            .then((pos) => {
                newEntry.location = {
                    lat: pos.coords.latitude,
                    long: pos.coords.longitude
                };
                // Write the entry to firebase (and also refresh the timeline via callback)
                // Yes, the callback use here is a bit out of step with later promise structures; I'll get around to updating it later, don't @ me
                dbCreateEntry(
                    newEntry,
                    authCtx.userID,
                    authCtx.token,
                    setEntries,
                    dbInitEntries
                );
                // Write the tags to the database
                dbTagWrite(
                    newEntry.tags,
                    tags,
                    newEntry.uuid,
                    authCtx.userID,
                    authCtx.token
                ).then(() => {
                    // Refresh the tags
                    dbInitTags(authCtx.token, authCtx.userID)
                        .then((tags) => {
                            setTags(tags);
                        })
                        .catch((err) => console.error(err));
                });
                // Close the form after that little journey
                // Does need to have a loading state though
                createEntryToggle();
            })
            .catch((err) => console.log(err));
    };
    // Handles entry changes
    const editEntryHandler = function (editedEntry) {
        // Identify altered fields, exclude the rest
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
            // Write the identified updates to firebase
            dbUpdateEntry(
                entryUpdates,
                authCtx.userID,
                authCtx.token,
                setEntries,
                dbInitEntries
            );
        }
    };
    // Deletes an entry
    const deleteEntryHandler = function (entryID) {
        // Tell firebase to remove it
        dbDeleteEntry(
            entryID,
            authCtx.userID,
            authCtx.token,
            setEntries,
            dbInitEntries
        );
    };

    /* 
        For each entry, find the tags in the tags array that matches the UUID in the entry tags array

    */

    // Not in use; may not be necessary actually since I think all the tag data is also stored in the entries themselves
    // const assignTags = function () {
    //     entries.map((entry) => {
    //         entry.tags.map((entryTag) => {
    //             return tags.find((stateTag) => {
    //                 return stateTag.uuid === entryTag;
    //             });
    //         });
    //     });
    // };

    // Does what it says on the tin; just wraps the whole dude in a promise
    const setLocation = function () {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };

    // Deactivated for the purposes of not accidentally racking up a mondo bill
    // Basically does reverse geocoding on form submit to get the human-legible version of where the user is.
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

    // Relocate to tags util file
    // Compares whether any of these tags are new ones and therefore whether they should be written
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

    // Hook that fires the init functionality once the use gets to the page
    useEffect(() => {
        if (authCtx.token) initApp();
        if (!authCtx.token) navigate("/");
        // Automatically scroll down to the bottom of the timeline and most recent entries
        document.getElementById("end").scrollIntoView();
    }, []);

    return (
        <Box>
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
            {tagDebug && (
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
            )}
        </Box>
    );
}

export default Home;
