import { Box, Paper, TextField, Typography, Button } from "@mui/material";
import { useState } from "react";

const CreateSurvivor = () => {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [birthDate, setBirthDate] = useState("");

    const [water, setWater] = useState("");
    const [food, setFood] = useState("");
    const [medication, setMedication] = useState("");
    const [ammo, setAmmo] = useState("");


    return (
        <Box component="form">
            <Paper elevation={3} sx={{display: "flex", alignItems: "center", justifyContent: "center", gap: 2, width: "600px", height: "390px", ml: 47}}>
                <Box sx={{display: "flex", alignItems: "flex-start", flexDirection: "column", gap: 2}}>
                    <Typography sx={{ml: 7}}> Create Survivor </Typography>

                    <TextField size="small" label="Name" value={name}
                        onChange={(event, value) => {
                            setName(value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Age" value={age}
                        onChange={(event, value) => {
                            setAge(value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Gender" value={gender}
                        onChange={(event, value) => {
                            setGender(value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Latitude" value={latitude}
                        onChange={(event, value) => {
                            setLatitude(value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Longitude" value={longitude}
                        onChange={(event, value) => {
                            setLongitude(value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Birth Date" value={birthDate} type="date" InputLabelProps={{shrink: true}} fullWidth
                        onChange={(event, value) => {
                            setBirthDate(value);
                        }}
                    ></TextField>
                </Box>

                <Box sx={{display: "flex", alignItems: "flex-start", mb: 14, flexDirection: "column", gap: 2}}>
                    <Typography sx={{ml: 7}}> Inventory Items </Typography>

                    <TextField size="small" label="Quantity of Water" value={water}
                        onChange={(event, value) => {
                            setWater(value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Quantity of Food" value={food}
                        onChange={(event, value) => {
                            setFood(value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Quantity of Medication" value={medication}
                        onChange={(event, value) => {
                            setMedication(value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Quantity of Ammo" value={ammo}
                        onChange={(event, value) => {
                            setAmmo(value);
                        }}
                    ></TextField>
                </Box>
            </Paper>

            <Button size="medium" type="submit" color="success" variant="contained" sx={{ml: "65%", mt: 2}}>Create</Button>
        </Box>
    );
};

export default CreateSurvivor;
