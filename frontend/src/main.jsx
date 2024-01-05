import { CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <CssBaseline />
        <BrowserRouter basename="/survivors">
            <Routes>
                <Route path="/*" element={<App />} />
                <Route path="/login" element={<SignInForm />} />
                <Route path="/register" element={<SignUpForm />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
