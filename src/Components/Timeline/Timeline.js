// Material UI
import { Typography, styled, Box } from "@mui/material";
// App files
import { TimelineEnd, TimelineEntry } from "./IndexTimeline";

const StyledBox = styled(Box)(({ theme }) => ({
    width: "100%",
    marginBottom: "auto",
    paddingTop: "50px"
}));

// Main display for entries. Contains both the entries themselves and various supporting visual elements.
const Timeline = function ({
    entries,
    deleteEntry,
    editEntry,
    createEntryHandler,
    createEntryMode,
    createEntryToggle,
    tags
}) {
    const empty = "No entries! Try writing something!";
    if (entries !== []) {
        return (
            <StyledBox>
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
            </StyledBox>
        );
    } else {
        // Presently doesn't display this message, probably hidden under the top bar.
        return <Typography>{empty}</Typography>;
    }
};

export default Timeline;
