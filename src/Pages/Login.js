import { TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = function () {
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // console.log("Login page mount");
        // console.log(`<Login/> -> authCtx.token: ${authCtx.token}`);
        if (authCtx.token) navigate("/home");
    }, [authCtx.token]);
    const emailHandler = function (e) {
        setEmail(e.target.value);
    };

    const passwordHandler = function (e) {
        setPassword(e.target.value);
    };

    const submitHandler = function () {
        authCtx.signIn(email, password).then(
            () => {
                setEmail("");
                setPassword("");
            },
            () => {
                console.log("Error -- credentials not accepted");
            }
        );
    };

    return (
        <Box
            display="flex"
            alignSelf="center"
            justifySelf="center"
            alignContent="center"
            justifyContent="center"
            alignItems="center"
            marginTop="25vw"
        >
            <Typography header1="true" display="flex">
                Please login
            </Typography>
            <br></br>
            <TextField
                outlined="true"
                label="Email Address"
                display="flex"
                onChange={emailHandler}
                value={email}
            />
            <br></br>
            <TextField
                outlined="true"
                label="Password"
                type="password"
                display="flex"
                onChange={passwordHandler}
                value={password}
            />
            <br></br>
            <Button onClick={submitHandler}>Sign In</Button>
        </Box>
    );
};

export default Login;
