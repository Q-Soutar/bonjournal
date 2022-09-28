// Material UI
import { Chip, Tooltip, styled, Zoom, Box } from "@mui/material";

const StyledChip = styled(Chip)({
    margin: "3px",
    maxWidth: "10vw",
    overflow: "hidden"
});

const Tag = function ({ tag, cardMode, deleteTagHandler }) {
    const deleteTagWrapper = function () {
        deleteTagHandler(tag);
    };
    return (
        <Box>
            <Tooltip title={tag.text} TransitionComponent={Zoom}>
                <StyledChip
                    label={tag.text}
                    onDelete={
                        cardMode !== "DISPLAY" ? deleteTagWrapper : undefined
                    }
                />
            </Tooltip>
        </Box>
    );
};

export default Tag;
