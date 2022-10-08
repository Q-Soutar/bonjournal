// Material UI
import { TimelineConnector, TimelineDot, TimelineSeparator } from "@mui/lab";
import { IconButton, styled, Box } from "@mui/material";
import {
    AddCircleIcon,
    DeleteForeverIcon,
    EditIcon
} from "../../Utils/IndexIcons";

const StyledTimelineSeparator = styled(TimelineSeparator)(({ theme }) => ({
    flex: "0 0 8vw",
    "& .MuiTimelineDot-root": {
        variant: "outlined",
        alignSelf: "center",
        borderColor: theme.palette.secondary.main,
        overflow: "visible",
        height: "3vw",
        width: "3vw",
        justifySelf: "center"
    },
    "& .MuiTimelineConnector-root": {
        backgroundColor: theme.palette.primary.main
    },
    "& .MuiSvgIcon-root": {
        display: "flex",
        marginLeft: "auto",
        color: theme.palette.secondary.main
    }
}));

//  Helper component that is basically a container for various timeline elements.
// Experimented with putting card controls here, but shelved that due to complexity. Retaining elements of that code to revisit later. Hence the unused props.
const ModifiedSeparator = function ({
    uuid,
    toggleExpand,
    expanded,
    deleteEntry,
    editModeToggle
}) {
    // Not utilized due to UI complexity of placing controls in this location in the DOM. I do want to revisit it later though, so this is code is retained here.
    // const deleteHandler = function () {
    //     toggleExpand();
    //     deleteEntry(uuid);
    // };
    return (
        <StyledTimelineSeparator>
            <TimelineConnector
                sx={{ overflow: "visible", justifySelf: "right" }}
            />
            <TimelineDot variant="outlined">
                {/* {expanded ? ( // Disabled experimentation with putting card controls in the timeline itself. Partially abandonned for a range of styling and prop drill reasons. 
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            backgroundColor: "#E5E4E2",
                            borderRadius: "50px",
                            height: "4vw",
                            alignSelf: "center",
                            justifySelf: "left",
                            borderWidth: "100px",
                            borderColor: "#EE7B30"
                        }}
                    >
                        <IconButton onClick={deleteHandler}>
                            <DeleteForeverIcon />
                        </IconButton>
                        <IconButton>
                            <EditIcon onClick={editModeToggle} />
                        </IconButton>
                    </Box>
                ) : (
                    <AddCircleIcon sx={{ opacity: "0%" }} />
                )} */}
                <AddCircleIcon sx={{ opacity: "0%" }} />
            </TimelineDot>
            <TimelineConnector />
        </StyledTimelineSeparator>
    );
};

export default ModifiedSeparator;
