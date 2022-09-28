// Material UI
import { Box } from "@mui/system";
import {
    DeleteForeverIcon,
    EditIcon,
    SaveIcon,
    CloseIcon,
    IconButton
} from "../../Utils/IndexIcons";

const CardControls = function ({
    cardMode = "DISPLAY",
    deleteHandler = () => {},
    submitHandler = () => {},
    editModeToggle = () => {},
    cancelHandler = () => {}
}) {
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
