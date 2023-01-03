import { Card, Button, Typography, CardContent, CardActions, CardMedia,Chip, Box, Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";

const Survivors = () => {
    const [survivors, setSurvivors] = useState([]);
    const [survivorsSearch, setSurvivorsSearch] = useState([]);

    const sortSurvivors = (survivors) => {
        return survivors.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    };

    const getAllSurvivors = async () => {
        await axios.get("http://127.0.0.1:8000/api/v1/survivors")
            .then((response) => {
                if (response.status == 200) {
                    const sortedSurvivors = sortSurvivors(response.data);
                    setSurvivors(sortedSurvivors);
                    if (!survivorsSearch.length) setSurvivorsSearch(response.data);
                } else {
                    console.log(response);
                }
            }).catch((e) => console.log(e));
    };

    const reportSurvivor = async (survivorId) => {
        await axios.patch(`http://127.0.0.1:8000/api/v1/survivors/${survivorId}/report/`)
            .then((response) => {
                if (response.status == 200) {
                    getAllSurvivors();
                } else {
                    console.log(response);
                }
            }).catch((e) => console.log(e));
    };

    useEffect(() => {
        document.title = "Survivors";
        getAllSurvivors();
    }, []);

    return (
        <>
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", mt: 4, width: "100%", position: "absolute", top: 0, left: 0, right: 0}}>
                <Autocomplete
                    multiple
                    options={survivorsSearch}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, value) => {
                        let s = [...value];
                        if (s.length) {
                            setSurvivors(s);
                        } else {
                            getAllSurvivors();
                        }
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
                    sx={{width: "700px",["@media (max-width:750px)"]: {
                        width: "450px",
                    }
                    }}
                />
            </Box>

            <Box sx={{display: "flex", alignItems: "flex-start", justifyContent: "flex-start", flexDirection: "row", ml: 5, mt: 15, flexWrap: "wrap", gap: 2}}>
                {survivors.map((survivor) => (
                    <Box key={survivor.id}>
                        <Card sx={{ width: 300, height: 350 }}>
                            {survivor.is_infected ? <CardMedia
                                sx={{ height: 140, width: "100%" }}
                                image="public/zombie.jpg"
                                title="zombie"
                            /> : <CardMedia
                                sx={{ height: 140, width: "100%" }}
                                image="public/survivor.jpg"
                                title="survivor healthy"
                            />}

                            <CardContent>

                                <Typography gutterBottom variant="h5" component="div" sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                    {survivor.name}
                                    {survivor.is_infected ? <Chip label="Infected" color="error" size="small" /> :  <Chip label="Healthy" color="success" size="small" />}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" >
                                Age: {survivor.age}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" >
                                Reports: {survivor.reports}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" >
                                Latitude: {survivor.latitude}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" >
                                Longitude: {survivor.longitude}
                                </Typography>

                                {survivor.is_infected ? <Typography variant="body2" color="text.secondary" >
                                                        Infected at {moment(survivor.infected_at).format("DD/MM/YYYY h:mm:ss a")}
                                </Typography> : null}

                            </CardContent>

                            <CardActions>
                                {survivor.is_infected ? null : <Button onClick={() => reportSurvivor(survivor.id)} size="small" color="error" variant="contained">Report</Button>}
                            </CardActions>

                        </Card>
                    </Box>
                ))}
            </Box>
        </>
    );
};

export default Survivors;
