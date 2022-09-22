import { useState } from "react";
import EntryCard from "../EntryCard/EntryCard";
import TimelineEnd from "./TimelineEnd";
import TimelineEntry from "./TimelineEntry";
import { Box } from "@mui/system";

const Timeline = function ({
    entries,
    deleteEntry,
    editEntry,
    createEntryHandler,
    createEntryMode,
    createEntryToggle,
    tags
}) {
    if (entries !== []) {
        return (
            <Box
                sx={{
                    width: "100%",
                    marginBottom: "auto",
                    paddingTop: "50px"
                }}
            >
                {entries.map((entry) => {
                    return (
                        <TimelineEntry
                            entry={entry}
                            deleteEntry={deleteEntry}
                            editEntry={editEntry}
                            key={entry.uuid}
                            startCardMode={"DISPLAY"}
                            tags={tags}
                        />
                    );
                })}
                <TimelineEnd
                    createEntryHandler={createEntryHandler}
                    createEntryMode={createEntryMode}
                    createEntryToggle={createEntryToggle}
                    tags={tags}
                />
            </Box>
        );
    } else {
        return "No entries";
    }
};

export default Timeline;
