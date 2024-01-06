import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";

import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import MedicationIcon from "@mui/icons-material/Medication";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { useNavigate } from "react-router-dom";
import api from "../utils/api/api";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TradesSurvivors = () => {
    const [survivors, setSurvivors] = useState([]);
    const [survivor1, setSurvivor1] = useState({});
    const [survivor2, setSurvivor2] = useState({});

    const [color, setColor] = useState("default");

    const [openSnackbarSuccess, setOpenSnackbarSuccess] = useState(false);
    const [openSnackbarError, setOpenSnackbarError] = useState(false);

    const handleCloseSuccess = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackbarSuccess(false);
    };

    const handleCloseError = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackbarError(false);
    };

    const [water1, setWater1] = useState(0);
    const [food1, setFood1] = useState(0);
    const [medication1, setMedication1] = useState(0);
    const [ammo1, setAmmo1] = useState(0);

    const [disabled1, setDisabled1] = useState(true);

    const [water2, setWater2] = useState(0);
    const [food2, setFood2] = useState(0);
    const [medication2, setMedication2] = useState(0);
    const [ammo2, setAmmo2] = useState(0);

    const [disabled2, setDisabled2] = useState(true);

    let waterTotal1 =
        (survivor1.inventory?.items.water?.points_per_unit ?? 0) * water1;
    let foodTotal1 =
        (survivor1.inventory?.items.food?.points_per_unit ?? 0) * food1;
    let medicationTotal1 =
        (survivor1.inventory?.items.medication?.points_per_unit ?? 0) *
        medication1;
    let ammoTotal1 =
        (survivor1.inventory?.items.ammo?.points_per_unit ?? 0) * ammo1;

    let totalPoints1 = waterTotal1 + foodTotal1 + medicationTotal1 + ammoTotal1;

    let waterTotal2 =
        (survivor2.inventory?.items.water?.points_per_unit ?? 0) * water2;
    let foodTotal2 =
        (survivor2.inventory?.items.food?.points_per_unit ?? 0) * food2;
    let medicationTotal2 =
        (survivor2.inventory?.items.medication?.points_per_unit ?? 0) *
        medication2;
    let ammoTotal2 =
        (survivor2.inventory?.items.ammo?.points_per_unit ?? 0) * ammo2;

    let totalPoints2 = waterTotal2 + foodTotal2 + medicationTotal2 + ammoTotal2;

    const navigate = useNavigate();

    const tradeItems = async () => {
        if (totalPoints1 != totalPoints2) {
            setColor("error");
            return;
        }

        await api
            .post("/api/v1/survivors/trade/", {
                survivor1: survivor1,
                survivor2: survivor2,
                items_to_trade_survivor1: {
                    water: water1,
                    food: food1,
                    medication: medication1,
                    ammo: ammo1,
                },
                items_to_trade_survivor2: {
                    water: water2,
                    food: food2,
                    medication: medication2,
                    ammo: ammo2,
                },
            })
            .then((response) => {
                console.log(response.status);
                if (response.status == 200) {
                    setColor("success");
                    setOpenSnackbarSuccess(true);
                    setTimeout(function () {
                        navigate("/");
                    }, 3000);
                }
            })
            .catch(() => setOpenSnackbarError(true));
    };

    const getSurvivor1 = async (id) => {
        setDisabled1(false);

        await api
            .get(`/api/v1/survivors/${id}/`)
            .then((response) => {
                if (response.status == 200) {
                    setColor("default");
                    setSurvivor1(response.data);
                } else {
                    console.log(response);
                }
            })
            .catch((e) => console.log(e));
    };

    const getSurvivor2 = async (id) => {
        setDisabled2(false);

        await api
            .get(`/api/v1/survivors/${id}/`)
            .then((response) => {
                if (response.status == 200) {
                    setColor("default");
                    setSurvivor2(response.data);
                } else {
                    console.log(response);
                }
            })
            .catch((e) => console.log(e));
    };

    const getAllSurvivorsHealthy = async () => {
        await api
            .get("/api/v1/survivors/healthys/")
            .then((response) => {
                if (response.status == 200) {
                    setSurvivors(response.data);
                } else {
                    console.log(response);
                }
            })
            .catch((e) => console.log(e));
    };

    useEffect(() => {
        document.title = "Survivors | Trades";
        getAllSurvivorsHealthy();
    }, []);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    aligItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 2,
                        width: "620px",
                        height: "500px",
                        ml: 2,
                    }}
                >
                    <Typography>Survivor 1</Typography>
                    <Autocomplete
                        multiple
                        options={survivors}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, value) => {
                            if (value.length > 1) {
                                value.shift();
                            }
                            getSurvivor1(value[0].id);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search survivor"
                                InputProps={{
                                    ...params.InputProps,
                                    type: "search",
                                }}
                            />
                        )}
                        sx={{
                            width: "500px",
                            ["@media (max-width:750px)"]: {
                                width: "450px",
                            },
                        }}
                    />

                    <List
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                        }}
                    >
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <LocalDrinkIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${
                                    survivor1.inventory?.items.water
                                        ?.quantity ?? 0
                                }x Waters`}
                                secondary={`Points:${
                                    survivor1.inventory?.items.water
                                        ?.total_points_item ?? 0
                                }`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <RestaurantIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${
                                    survivor1.inventory?.items.food?.quantity ??
                                    0
                                }x Foods`}
                                secondary={`Points:${
                                    survivor1.inventory?.items.food
                                        ?.total_points_item ?? 0
                                }`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <MedicationIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${
                                    survivor1.inventory?.items.medication
                                        ?.quantity ?? 0
                                }x Medications`}
                                secondary={`Points:${
                                    survivor1.inventory?.items.medication
                                        ?.total_points_item ?? 0
                                }`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <svg
                                        fill="#ffffff"
                                        height="30px"
                                        color="white"
                                        width="100px"
                                        version="1.1"
                                        id="Layer_1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 500 500"
                                        xmlSpace="preserve"
                                    >
                                        <g
                                            id="SVGRepo_bgCarrier"
                                            strokeWidth="0"
                                        ></g>
                                        <g id="SVGRepo_iconCarrier" /> <g />{" "}
                                        <g />{" "}
                                        <path d="M326.718,459.023h0.942V150.104C327.66,143.974,326.859,0,257.024,0s-70.636,143.974-70.636,150.104v308.918h-1.106 c-14.559,0-26.407,11.882-26.407,26.489c0,14.607,11.848,26.489,26.407,26.489h141.437c14.559,0,26.407-11.882,26.407-26.489 C353.125,470.905,341.278,459.023,326.718,459.023z M256,17.545c40.272,0,51.404,81.673,52.814,123.614H203.182 C204.57,99.218,215.676,17.545,256,17.545z M310.001,158.818v300.205H204.047V158.818H310.001z M326.718,494.341H185.282 c-4.906,0-8.748-3.88-8.748-8.83c0-4.872,3.923-8.83,8.748-8.83h8.911h123.614h8.911c4.906,0,8.748,3.88,8.748,8.83 C335.466,490.383,331.543,494.341,326.718,494.341z" />
                                    </svg>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${
                                    survivor1.inventory?.items.ammo?.quantity ??
                                    0
                                }x Ammos`}
                                secondary={`Points:${
                                    survivor1.inventory?.items.ammo
                                        ?.total_points_item ?? 0
                                }`}
                            />
                        </ListItem>
                    </List>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            flexDirection: "row",
                            gap: 2,
                        }}
                    >
                        <TextField
                            size="small"
                            label="Quantity of Water"
                            disabled={disabled1}
                            value={water1 == 0 ? "" : water1}
                            InputLabelProps={{ shrink: true }}
                            onChange={(event) => {
                                if (event.target.value == "") {
                                    setWater1(0);
                                } else {
                                    setWater1(event.target.value);
                                }
                            }}
                        ></TextField>
                        <TextField
                            size="small"
                            label="Quantity of Food"
                            disabled={disabled1}
                            value={food1 == 0 ? "" : food1}
                            InputLabelProps={{ shrink: true }}
                            onChange={(event) => {
                                if (event.target.value == "") {
                                    setFood1(0);
                                } else {
                                    setFood1(event.target.value);
                                }
                            }}
                        ></TextField>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            flexDirection: "row",
                            gap: 2,
                        }}
                    >
                        <TextField
                            size="small"
                            label="Quantity of Medication"
                            disabled={disabled1}
                            value={medication1 == 0 ? "" : medication1}
                            InputLabelProps={{ shrink: true }}
                            onChange={(event) => {
                                if (event.target.value == "") {
                                    setMedication1(0);
                                } else {
                                    setMedication1(event.target.value);
                                }
                            }}
                        ></TextField>
                        <TextField
                            size="small"
                            label="Quantity of Ammo"
                            disabled={disabled1}
                            value={ammo1 == 0 ? "" : ammo1}
                            InputLabelProps={{ shrink: true }}
                            onChange={(event) => {
                                if (event.target.value == "") {
                                    setAmmo1(0);
                                } else {
                                    setAmmo1(event.target.value);
                                }
                            }}
                        ></TextField>
                    </Box>

                    <Chip
                        color={color}
                        size="medium"
                        label={`Total Points: ${totalPoints1}`}
                    />
                </Paper>

                <Paper
                    elevation={3}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 2,
                        width: "620px",
                        height: "500px",
                    }}
                >
                    <Typography>Survivor 2</Typography>

                    <Autocomplete
                        multiple
                        options={survivors}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, value) => {
                            if (value.length > 1) {
                                value.shift();
                            }
                            getSurvivor2(value[0].id);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search survivor"
                                InputProps={{
                                    ...params.InputProps,
                                    type: "search",
                                }}
                            />
                        )}
                        sx={{
                            width: "500px",
                            ["@media (max-width:750px)"]: {
                                width: "450px",
                            },
                        }}
                    />

                    <List
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                        }}
                    >
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <LocalDrinkIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${
                                    survivor2.inventory?.items.water
                                        ?.quantity ?? 0
                                }x Waters`}
                                secondary={`Points:${
                                    survivor2.inventory?.items.water
                                        ?.total_points_item ?? 0
                                }`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <RestaurantIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${
                                    survivor2.inventory?.items.food?.quantity ??
                                    0
                                }x Foods`}
                                secondary={`Points:${
                                    survivor2.inventory?.items.food
                                        ?.total_points_item ?? 0
                                }`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <MedicationIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${
                                    survivor2.inventory?.items.medication
                                        ?.quantity ?? 0
                                }x Medications`}
                                secondary={`Points:${
                                    survivor2.inventory?.items.medication
                                        ?.total_points_item ?? 0
                                }`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <svg
                                        fill="#ffffff"
                                        height="30px"
                                        color="white"
                                        width="100px"
                                        version="1.1"
                                        id="Layer_1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 500 500"
                                        xmlSpace="preserve"
                                    >
                                        <g
                                            id="SVGRepo_bgCarrier"
                                            strokeWidth="0"
                                        ></g>
                                        <g id="SVGRepo_iconCarrier" /> <g />{" "}
                                        <g />{" "}
                                        <path d="M326.718,459.023h0.942V150.104C327.66,143.974,326.859,0,257.024,0s-70.636,143.974-70.636,150.104v308.918h-1.106 c-14.559,0-26.407,11.882-26.407,26.489c0,14.607,11.848,26.489,26.407,26.489h141.437c14.559,0,26.407-11.882,26.407-26.489 C353.125,470.905,341.278,459.023,326.718,459.023z M256,17.545c40.272,0,51.404,81.673,52.814,123.614H203.182 C204.57,99.218,215.676,17.545,256,17.545z M310.001,158.818v300.205H204.047V158.818H310.001z M326.718,494.341H185.282 c-4.906,0-8.748-3.88-8.748-8.83c0-4.872,3.923-8.83,8.748-8.83h8.911h123.614h8.911c4.906,0,8.748,3.88,8.748,8.83 C335.466,490.383,331.543,494.341,326.718,494.341z" />
                                    </svg>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${
                                    survivor2.inventory?.items.ammo?.quantity ??
                                    0
                                }x Ammos`}
                                secondary={`Points:${
                                    survivor2.inventory?.items.ammo
                                        ?.total_points_item ?? 0
                                }`}
                            />
                        </ListItem>
                    </List>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            flexDirection: "row",
                            gap: 2,
                        }}
                    >
                        <TextField
                            size="small"
                            label="Quantity of Water"
                            disabled={disabled2}
                            value={water2 == 0 ? "" : water2}
                            InputLabelProps={{ shrink: true }}
                            onChange={(event) => {
                                if (event.target.value == "") {
                                    setWater2(0);
                                } else {
                                    setWater2(event.target.value);
                                }
                            }}
                        ></TextField>
                        <TextField
                            size="small"
                            label="Quantity of Food"
                            disabled={disabled2}
                            value={food2 == 0 ? "" : food2}
                            InputLabelProps={{ shrink: true }}
                            onChange={(event) => {
                                if (event.target.value == "") {
                                    setFood2(0);
                                } else {
                                    setFood2(event.target.value);
                                }
                            }}
                        ></TextField>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            flexDirection: "row",
                            gap: 2,
                        }}
                    >
                        <TextField
                            size="small"
                            label="Quantity of Medication"
                            disabled={disabled2}
                            value={medication2 == 0 ? "" : medication2}
                            InputLabelProps={{ shrink: true }}
                            onChange={(event) => {
                                if (event.target.value == "") {
                                    setMedication2(0);
                                } else {
                                    setMedication2(event.target.value);
                                }
                            }}
                        ></TextField>
                        <TextField
                            size="small"
                            label="Quantity of Ammo"
                            disabled={disabled2}
                            value={ammo2 == 0 ? "" : ammo2}
                            InputLabelProps={{ shrink: true }}
                            onChange={(event) => {
                                if (event.target.value == "") {
                                    setAmmo2(0);
                                } else {
                                    setAmmo2(event.target.value);
                                }
                            }}
                        ></TextField>
                    </Box>

                    <Chip
                        color={color}
                        size="medium"
                        label={`Total Points: ${totalPoints2}`}
                    />
                </Paper>
            </Box>
            <Button
                sx={{ ml: 80, mt: 5 }}
                size="medium"
                color="primary"
                onClick={() => tradeItems()}
                variant="contained"
            >
                Trade
            </Button>

            <Snackbar
                open={openSnackbarSuccess}
                autoHideDuration={3000}
                onClose={handleCloseSuccess}
            >
                <Alert
                    onClose={handleCloseSuccess}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Trade Done!
                </Alert>
            </Snackbar>

            <Snackbar
                open={openSnackbarError}
                autoHideDuration={5000}
                onClose={handleCloseError}
            >
                <Alert
                    onClose={handleCloseError}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    Something is wrong in trading. Check if the survivors has
                    the specified trade items and quantity!
                </Alert>
            </Snackbar>
        </>
    );
};

export default TradesSurvivors;
