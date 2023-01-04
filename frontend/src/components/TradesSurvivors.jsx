import { Autocomplete, Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Button, Chip } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MedicationIcon from "@mui/icons-material/Medication";


const TradesSurvivors = () => {
    const [survivors, setSurvivors] = useState([]);
    const [survivor1, setSurvivor1] = useState({});
    const [survivor2, setSurvivor2] = useState({});

    const [disableInput1, setDisableInput1] = useState(false);
    const [disableInput2, setDisableInput2] = useState(false);

    const [color, setColor] = useState("default");

    const changeSurvivor1 = () => {
        setDisableInput1(false);
        setSurvivor1({});
    };

    const changeSurvivor2 = () => {
        setDisableInput2(false);
        setSurvivor2({});
    };

    const tradeItems = async () => {
        await axios.get("http://127.0.0.1:8000/api/v1/survivors/trade/")
            .then((response) => {
                if (response.status == 200) {
                    setSurvivor1(response.data);
                } else {
                    console.log(response);
                }
            }).catch((e) => console.log(e));
    };

    const getSurvivor1 = async (id) => {
        await axios.get(`http://127.0.0.1:8000/api/v1/survivors/${id}/`)
            .then((response) => {
                if (response.status == 200) {
                    setSurvivor1(response.data);
                } else {
                    console.log(response);
                }
            }).catch((e) => console.log(e));
    };

    const getSurvivor2 = async (id) => {
        await axios.get(`http://127.0.0.1:8000/api/v1/survivors/${id}/`)
            .then((response) => {
                if (response.status == 200) {
                    setSurvivor2(response.data);
                } else {
                    console.log(response);
                }
            }).catch((e) => console.log(e));
    };

    const getAllSurvivors = async () => {
        await axios.get("http://127.0.0.1:8000/api/v1/survivors")
            .then((response) => {
                if (response.status == 200) {
                    setSurvivors(response.data);
                } else {
                    console.log(response);
                }
            }).catch((e) => console.log(e));
    };

    useEffect(() => {
        document.title = "Survivors | Trades";
        getAllSurvivors();
    }, []);

    return (
        <>
            <Box sx={{display: "flex", aligItems: "flex-start", justifyContent: "space-between", gap: 12}}>
                <Paper elevation={3} sx={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2, width: "620px", height: "500px", ml: 2}}>
                    <Autocomplete
                        multiple
                        options={survivors}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, value) => {
                            if (value.length > 1) {
                                value.shift();
                            }
                            setDisableInput1(true);
                            getSurvivor1(value[0].id);
                        }}
                        disabled={disableInput1}
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
                        sx={{width: "500px",["@media (max-width:750px)"]: {
                            width: "450px",
                        }
                        }}
                    />

                    <List sx={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <LocalDrinkIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`${survivor1.inventory?.items.water?.quantity ?? 0}x Waters`} secondary={`Points:${survivor1.inventory?.items.water?.total_points_item ?? 0}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <RestaurantIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`${survivor1.inventory?.items.food?.quantity ?? 0}x Foods`} secondary={`Points:${survivor1.inventory?.items.food?.total_points_item ?? 0}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <MedicationIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`${survivor1.inventory?.items.medication?.quantity ?? 0}x Medications`} secondary={`Points:${survivor1.inventory?.items.medication?.total_points_item ?? 0}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <svg fill="#ffffff" height="30px" color="white" width="100px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_iconCarrier"/> <g/> <g/> <path d="M326.718,459.023h0.942V150.104C327.66,143.974,326.859,0,257.024,0s-70.636,143.974-70.636,150.104v308.918h-1.106 c-14.559,0-26.407,11.882-26.407,26.489c0,14.607,11.848,26.489,26.407,26.489h141.437c14.559,0,26.407-11.882,26.407-26.489 C353.125,470.905,341.278,459.023,326.718,459.023z M256,17.545c40.272,0,51.404,81.673,52.814,123.614H203.182 C204.57,99.218,215.676,17.545,256,17.545z M310.001,158.818v300.205H204.047V158.818H310.001z M326.718,494.341H185.282 c-4.906,0-8.748-3.88-8.748-8.83c0-4.872,3.923-8.83,8.748-8.83h8.911h123.614h8.911c4.906,0,8.748,3.88,8.748,8.83 C335.466,490.383,331.543,494.341,326.718,494.341z" /></svg>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`${survivor1.inventory?.items.ammo?.quantity ?? 0}x Ammos`} secondary={`Points:${survivor1.inventory?.items.ammo?.total_points_item ?? 0}`} />
                        </ListItem>
                    </List>

                    <Chip color="default" size="medium" label={`Total Points: ${survivor1.inventory?.items.total_points ?? 0}`} />
                    <Button size="medium" color="primary" onClick={() => changeSurvivor1()} variant="contained">Change Survivor</Button>
                </Paper>

                <Paper elevation={3} sx={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2, width: "620px", height: "500px"}}>
                    <Autocomplete
                        multiple
                        options={survivors}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, value) => {
                            if (value.length > 1) {
                                value.shift();
                            }
                            setDisableInput2(true);
                            getSurvivor2(value[0].id);
                        }}
                        disabled={disableInput2}
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
                        sx={{width: "500px",["@media (max-width:750px)"]: {
                            width: "450px",
                        }
                        }}
                    />

                    <List sx={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <LocalDrinkIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`${survivor2.inventory?.items.water?.quantity ?? 0}x Waters`} secondary={`Points:${survivor2.inventory?.items.water?.total_points_item ?? 0}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <RestaurantIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`${survivor2.inventory?.items.food?.quantity ?? 0}x Foods`} secondary={`Points:${survivor2.inventory?.items.food?.total_points_item ?? 0}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <MedicationIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`${survivor2.inventory?.items.medication?.quantity ?? 0}x Medications`} secondary={`Points:${survivor2.inventory?.items.medication?.total_points_item ?? 0}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <svg fill="#ffffff" height="30px" color="white" width="100px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_iconCarrier"/> <g/> <g/> <path d="M326.718,459.023h0.942V150.104C327.66,143.974,326.859,0,257.024,0s-70.636,143.974-70.636,150.104v308.918h-1.106 c-14.559,0-26.407,11.882-26.407,26.489c0,14.607,11.848,26.489,26.407,26.489h141.437c14.559,0,26.407-11.882,26.407-26.489 C353.125,470.905,341.278,459.023,326.718,459.023z M256,17.545c40.272,0,51.404,81.673,52.814,123.614H203.182 C204.57,99.218,215.676,17.545,256,17.545z M310.001,158.818v300.205H204.047V158.818H310.001z M326.718,494.341H185.282 c-4.906,0-8.748-3.88-8.748-8.83c0-4.872,3.923-8.83,8.748-8.83h8.911h123.614h8.911c4.906,0,8.748,3.88,8.748,8.83 C335.466,490.383,331.543,494.341,326.718,494.341z" /></svg>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`${survivor2.inventory?.items.ammo?.quantity ?? 0}x Ammos`} secondary={`Points:${survivor2.inventory?.items.ammo?.total_points_item ?? 0}`} />
                        </ListItem>
                    </List>

                    <Chip color="default" size="medium" label={`Total Points: ${survivor2.inventory?.items.total_points ?? 0}`} />
                    <Button size="medium" color="primary" onClick={() => changeSurvivor2()} variant="contained">Change Survivor</Button>
                </Paper>
            </Box>
        </>
    );
};

export default TradesSurvivors;
