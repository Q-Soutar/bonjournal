import { useState } from "react";
import EntryCard from "../EntryCard/EntryCard";
import TimelineEnd from "./TimelineEnd";
import TimelineEntry from "./TimelineEntry";
import { Box } from "@mui/system";

const Timeline = function (props) {
    if (props.entries !== []) {
        return (
            <Box
                sx={{
                    width: "100%",
                    marginBottom: "auto",
                    paddingTop: "50px"
                }}
            >
                {props.entries.map((entry) => {
                    return (
                        <TimelineEntry
                            entry={entry}
                            deleteEntry={props.deleteEntry}
                            editEntry={props.editEntry}
                            key={entry.uuid}
                            startCardMode={"DISPLAY"}
                        />
                    );
                })}
                <TimelineEnd
                    createEntryHandler={props.createEntryHandler}
                    createEntryMode={props.createEntryMode}
                    createEntryToggle={props.createEntryToggle}
                />
            </Box>
        );
    } else {
        return "No entries";
    }
};

export default Timeline;
