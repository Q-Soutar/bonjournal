// Material UI
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
// App files
import { TimelineEnd, TimelineEntry } from "./IndexTimeline";

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
        // Yeah, this doesn't acutally do anything
        return <Typography>"No entries!"</Typography>;
    }
};

export default Timeline;
