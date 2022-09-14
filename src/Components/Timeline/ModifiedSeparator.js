// React imoprts
import { useContext } from "react";
// Material UI imports
import { TimelineConnector, TimelineDot, TimelineSeparator } from "@mui/lab";
import { IconButton, styled } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/material";
// App file imports
// import EntriesContext from "../Context/EntriesContext";

const StyledTimelineSeparator = styled(TimelineSeparator)(({ theme }) => ({
    flex: "0 0 8vw",
    "& .MuiTimelineDot-root": {
        variant: "outlined",
        alignSelf: "center",
        borderColor: theme.palette.secondary.main
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

// * Helper component that is basically a container for various timeline elements.
const ModifiedSeparator = function (props) {
    // const entriesCtx = useContext(EntriesContext);
    const deleteHandler = function () {
        props.toggleExpand();
        // entriesCtx.deleteEntry(props.uuid);
        props.deleteEntry(props.uuid);
    };
    return (
        <StyledTimelineSeparator>
            <TimelineConnector
                sx={{ overflow: "visible", justifySelf: "right" }}
            />
            <TimelineDot
                variant="outlined"
                sx={{
                    overflow: "visible",
                    height: "3vw",
                    width: "3vw",
                    justifySelf: "center"
                }}
            >
                {props.expanded ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            backgroundColor: "#E5E4E2",
                            borderRadius: "50px",
                            height: "4vw",
                            // padding: "0px",
                            // margin: "0px",
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
                            <EditIcon />
                        </IconButton>
                    </Box>
                ) : (
                    <AddCircleIcon sx={{ opacity: "0%" }} />
                )}
            </TimelineDot>
            <TimelineConnector />
        </StyledTimelineSeparator>
    );
};

export default ModifiedSeparator;
