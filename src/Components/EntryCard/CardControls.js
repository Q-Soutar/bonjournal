// Material UI
import { Box } from "@mui/system";
import {
    DeleteForeverIcon,
    EditIcon,
    SaveIcon,
    CloseIcon,
    IconButton
} from "../../Utils/IndexIcons";

// Set of buttons to control the entry card
const CardControls = function ({
    cardMode = "DISPLAY",
    deleteHandler = () => {},
    submitHandler = () => {},
    editModeToggle = () => {},
    cancelHandler = () => {}
}) {
    // Wrappers to fire functions that live in the parent component
    const deleteWrapper = function (e) {
        e.stopPropagation();
        deleteHandler();
    };
    const submitWrapper = function (e) {
        e.stopPropagation();
        submitHandler();
    };
    const editModeWrapper = function (e) {
        e.stopPropagation();
        editModeToggle();
    };
    const cancelWrapper = function (e) {
        e.stopPropagation();
        cancelHandler();
    };
    return (
        <Box>
            {cardMode !== "DISPLAY" && (
                <Box>
                    <IconButton onClick={submitWrapper}>
                        <SaveIcon />
                    </IconButton>
                    <IconButton onClick={cancelWrapper}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            )}
            {cardMode === "DISPLAY" && (
                <IconButton onClick={editModeWrapper}>
                    <EditIcon />
                </IconButton>
            )}
            {cardMode !== "CREATE" && (
                <IconButton onClick={deleteWrapper}>
                    <DeleteForeverIcon />
                </IconButton>
            )}
        </Box>
    );
};

export default CardControls;
