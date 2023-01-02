import { Grid, Card, Button, Typography, CardContent, CardActions, CardMedia,Chip } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const Survivors = () => {
    const [survivors, setSurvivors] = useState([]);

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
        getAllSurvivors();
    }, []);

    return (
        <Grid container spacing={2} rowSpacing={2} direction="row" alignItems="center" justifyContent="space-between">
            {survivors.map((survivor) => (
                <Grid item xs={4} sm={4} md={6} lg={4} xl={8} key={survivor.id}>
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
                                Infected at {survivor.infected_at}
                            </Typography> : null}
                        </CardContent>
                        <CardActions>
                            {survivor.is_infected ? null : <Button onClick={() => reportSurvivor(survivor.id)} size="small" color="error" variant="contained">Report</Button>}
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default Survivors;
