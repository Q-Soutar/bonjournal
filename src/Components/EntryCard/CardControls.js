import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

const CardControls = function ({
    cardMode = "DISPLAY",
    deleteHandler = () => {},
    submitHandler = () => {},
    editModeToggle = () => {},
    cancelHandler = () => {}
}) {
    return (
        <div>
            {cardMode !== "DISPLAY" && (
                <div>
                    <IconButton onClick={submitHandler}>
                        <SaveIcon />
                    </IconButton>
                    <IconButton onClick={cancelHandler}>
                        <CloseIcon />
                    </IconButton>
                    {/* <button onClick={submitHandler}>Save</button> */}
                    {/* <button onClick={cancelHandler}>Cancel</button> */}
                </div>
            )}
            {cardMode === "DISPLAY" && (
                <IconButton onClick={editModeToggle}>
                    <EditIcon />
                </IconButton>
            )}
            {cardMode !== "CREATE" && (
                <IconButton onClick={deleteHandler}>
                    <DeleteForeverIcon />
                </IconButton>
            )}
        </div>
    );
};

export default CardControls;
