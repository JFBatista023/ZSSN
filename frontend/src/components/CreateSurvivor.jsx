import { Box, Paper, TextField, Typography, Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const CreateSurvivor = () => {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [birthDate, setBirthDate] = useState("");

    const [water, setWater] = useState(0);
    const [food, setFood] = useState(0);
    const [medication, setMedication] = useState(0);
    const [ammo, setAmmo] = useState(0);

    useEffect(() => {
        document.title = "Survivors | Create";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://127.0.0.1:8000/api/v1/survivors/", {
            "survivor": {
                "name": name,
                "age": age,
                "gender": gender,
                "latitude": latitude,
                "longitude": longitude,
                "birth_date": birthDate
            },
            "inventory": {
                "items": {
                    "water": water,
                    "food": food,
                    "medication": medication,
                    "ammo": ammo
                }
            }
        }).then((response) => {
            if (response.status == 201) {
                console.log(response.data);
            }
        }).catch((err) => console.log(err));
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Paper elevation={3} sx={{display: "flex", alignItems: "center", justifyContent: "center", gap: 2, width: "600px", height: "390px", ml: 47}}>
                <Box sx={{display: "flex", alignItems: "flex-start", flexDirection: "column", gap: 2}}>
                    <Typography sx={{ml: 7}}> Create Survivor </Typography>

                    <TextField size="small" label="Name" value={name} InputLabelProps={{shrink: true}}
                        onChange={(event) => {
                            setName(event.target.value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Age" value={age} InputLabelProps={{shrink: true}}
                        onChange={(event) => {
                            setAge(event.target.value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Gender" value={gender} InputLabelProps={{shrink: true}}
                        onChange={(event) => {
                            setGender(event.target.value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Latitude" value={latitude} InputLabelProps={{shrink: true}}
                        onChange={(event) => {
                            setLatitude(event.target.value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Longitude" value={longitude} InputLabelProps={{shrink: true}}
                        onChange={(event) => {
                            setLongitude(event.target.value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Birth Date" value={birthDate} type="date" InputLabelProps={{shrink: true}} fullWidth
                        onChange={(event) => {
                            setBirthDate(event.target.value);
                        }}
                    ></TextField>
                </Box>

                <Box sx={{display: "flex", alignItems: "flex-start", mb: 14, flexDirection: "column", gap: 2}}>
                    <Typography sx={{ml: 7}}> Inventory Items </Typography>

                    <TextField size="small" label="Quantity of Water" value={water == 0 ? "" : water} InputLabelProps={{shrink: true}}
                        onChange={(event) => {
                            setWater(event.target.value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Quantity of Food" value={food == 0 ? "" : food} InputLabelProps={{shrink: true}}
                        onChange={(event) => {
                            setFood(event.target.value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Quantity of Medication" value={medication == 0 ? "" : medication} InputLabelProps={{shrink: true}}
                        onChange={(event) => {
                            setMedication(event.target.value);
                        }}
                    ></TextField>
                    <TextField size="small" label="Quantity of Ammo" value={ammo == 0 ? "" : ammo} InputLabelProps={{shrink: true}}
                        onChange={(event) => {
                            setAmmo(event.target.value);
                        }}
                    ></TextField>
                </Box>
            </Paper>

            <Button size="medium" type="submit" color="success" variant="contained" sx={{ml: "65%", mt: 2}}>Create</Button>
        </Box>
    );
};

export default CreateSurvivor;
