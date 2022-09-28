// Material UI
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Box, IconButton } from "@mui/material";
import { EditIcon, SaveIcon, CloseIcon } from "../../Utils/IndexIcons";

const AccountControls = function ({
    editMode,
    toggleEditMode,
    submitHandlerWrapper,
    cancelHandler
}) {
    return (
        <Grid2 container xs={2} spacing={5}>
            <Grid2 item xs={1}>
                {editMode && (
                    <IconButton onClick={submitHandlerWrapper}>
                        <SaveIcon />
                    </IconButton>
                )}
            </Grid2>
            <Grid2 item xs={1}>
                {!editMode && (
                    <IconButton onClick={toggleEditMode}>
                        <EditIcon />
                    </IconButton>
                )}
                {editMode && (
                    <IconButton onClick={cancelHandler}>
                        <CloseIcon />
                    </IconButton>
                )}
            </Grid2>
        </Grid2>
    );
};
export default AccountControls;
