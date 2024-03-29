import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api/api";
import useAuthStore from "../utils/stores/authStore";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
};

const Survivors = () => {
    const [survivors, setSurvivors] = useState([]);
    const [survivorsSearch, setSurvivorsSearch] = useState([]);

    const [percentageInfected, setPercentageInfected] = useState("0%");
    const [percentageHealthy, setPercentageHealthy] = useState("0%");
    const [waterPerSurvivor, setWaterPerSurvivor] = useState(0);
    const [foodPerSurvivor, setFoodPerSurvivor] = useState(0);
    const [medicationPerSurvivor, setMedicationPerSurvivor] = useState(0);
    const [ammoPerSurvivor, setAmmoPerSurvivor] = useState(0);
    const [lostPoints, setLostPoints] = useState(0);
    const [remainingPoints, setRemainingPoints] = useState(0);

    const [openInfos, setOpenInfos] = useState(false);

    const [modalData, setModalData] = useState({
        open: false,
        survivorId: null,
    });

    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    const { logout, username } = useAuthStore();
    console.log(username);

    const getPercentageInfected = async () => {
        await api
            .get("/api/v1/survivors/info/infected/")
            .then((response) => {
                if (response.status == 200) {
                    setPercentageInfected(response.data["percentage_infected"]);
                } else {
                    console.log(response);
                }
            })
            .catch((e) => console.log(e));
    };

    const getPercentageHealthy = async () => {
        await api
            .get("/api/v1/survivors/info/healthy/")
            .then((response) => {
                if (response.status == 200) {
                    setPercentageHealthy(response.data["percentage_healthy"]);
                } else {
                    console.log(response);
                }
            })
            .catch((e) => console.log(e));
    };

    const getItemsPerSurvivor = async () => {
        await api
            .get("/api/v1/survivors/info/items/")
            .then((response) => {
                if (response.status == 200) {
                    const items = response.data["averages_items"];
                    setWaterPerSurvivor(items["water_per_survivor"]);
                    setFoodPerSurvivor(items["food_per_survivor"]);
                    setMedicationPerSurvivor(items["medication_per_survivor"]);
                    setAmmoPerSurvivor(items["ammo_per_survivor"]);
                } else {
                    console.log(response);
                }
            })
            .catch((e) => console.log(e));
    };

    const getPoints = async () => {
        await api
            .get("/api/v1/survivors/info/points/")
            .then((response) => {
                if (response.status == 200) {
                    setLostPoints(response.data["lost_points"]);
                    setRemainingPoints(response.data["remaining_points"]);
                } else {
                    console.log(response);
                }
            })
            .catch((e) => console.log(e));
    };

    const handleOpenCoordinates = (survivorId) => {
        setModalData({ open: true, survivorId: survivorId });
    };
    const handleCloseCoordinates = () => {
        setModalData({ open: false });
    };

    const handleOpenInfos = () => {
        getPercentageInfected();
        getPercentageHealthy();
        getItemsPerSurvivor();
        getPoints();
        setOpenInfos(true);
    };
    const handleCloseInfos = () => setOpenInfos(false);

    const navigate = useNavigate();

    const sortSurvivors = (survivors) => {
        return survivors.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
    };

    const getAllSurvivors = async () => {
        await api
            .get("api/v1/survivors")
            .then((response) => {
                if (response.status == 200) {
                    const sortedSurvivors = sortSurvivors(response.data);
                    setSurvivors(sortedSurvivors);
                    if (!survivorsSearch.length)
                        setSurvivorsSearch(response.data);
                } else {
                    console.log(response);
                }
            })
            .catch((e) => console.log(e));
    };

    const reportSurvivor = async (survivorId) => {
        await api
            .patch(`api/v1/survivors/${survivorId}/report/`)
            .then((response) => {
                if (response.status == 200) {
                    getAllSurvivors();
                } else {
                    console.log(response);
                }
            })
            .catch((e) => console.log(e));
    };

    const updateSurvivorCoordinates = async (survivorId) => {
        await api
            .patch(`api/v1/survivors/${survivorId}/`, {
                coordinates: {
                    latitude: latitude,
                    longitude: longitude,
                },
            })
            .then((response) => {
                if (response.status == 200) {
                    getAllSurvivors();
                    setTimeout(function () {
                        handleCloseCoordinates();
                    }, 2000);
                } else {
                    console.log(response);
                }
            })
            .catch((e) => console.log(e));
    };

    useEffect(() => {
        document.title = "Survivors | List";
        getAllSurvivors();
    }, []);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 4,
                    ml: 11,
                    width: "950px",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                }}
            >
                <Button
                    size="medium"
                    color="info"
                    sx={{ mr: 3 }}
                    variant="contained"
                    onClick={() => handleOpenInfos()}
                >
                    Infos
                </Button>
                <Button
                    size="medium"
                    color="primary"
                    sx={{ mr: 3 }}
                    variant="contained"
                    onClick={() => navigate("/trades")}
                >
                    Trades
                </Button>
                <Button
                    size="medium"
                    color="error"
                    sx={{ mr: 3 }}
                    variant="contained"
                    onClick={() => {
                        logout();
                    }}
                >
                    Logout
                </Button>

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
                    limitTags={2}
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
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    ml: 5,
                    mt: 15,
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                {survivors.map((survivor) => (
                    <Box key={survivor.id}>
                        <Card sx={{ width: 300, height: 354 }}>
                            {survivor.is_infected ? (
                                <CardMedia
                                    sx={{ height: 140, width: "100%" }}
                                    image="/zombie.jpg"
                                    title="zombie"
                                />
                            ) : survivor.gender == "M" ? (
                                <CardMedia
                                    sx={{ height: 140, width: "100%" }}
                                    image="/survivor-male.jpg"
                                    title="survivor healthy"
                                />
                            ) : (
                                <CardMedia
                                    sx={{ height: 140, width: "100%" }}
                                    image="/survivor-female.jpg"
                                    title="survivor healthy"
                                />
                            )}

                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        fontSize: "20px",
                                    }}
                                >
                                    {survivor.name}
                                    {survivor.is_infected ? (
                                        <Chip
                                            label="Infected"
                                            color="error"
                                            size="small"
                                        />
                                    ) : (
                                        <Chip
                                            label="Healthy"
                                            color="success"
                                            size="small"
                                        />
                                    )}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Age: {survivor.age}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Gender: {survivor.gender}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Reports: {survivor.reports}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Latitude: {survivor.latitude}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Longitude: {survivor.longitude}
                                </Typography>

                                {survivor.is_infected ? (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Infected at{" "}
                                        {moment(survivor.infected_at).format(
                                            "DD/MM/YYYY h:mm:ss a"
                                        )}
                                    </Typography>
                                ) : null}
                            </CardContent>

                            <CardActions sx={{ gap: 2 }}>
                                {survivor.is_infected ||
                                username != survivor.name ? null : (
                                    <Button
                                        onClick={() =>
                                            handleOpenCoordinates(survivor.id)
                                        }
                                        size="small"
                                        color="primary"
                                        variant="contained"
                                    >
                                        Update Coordinates
                                    </Button>
                                )}
                                {survivor.is_infected ? null : (
                                    <Button
                                        onClick={() =>
                                            reportSurvivor(survivor.id)
                                        }
                                        sx={{ ml: 24 }}
                                        size="small"
                                        color="error"
                                        variant="contained"
                                    >
                                        Report
                                    </Button>
                                )}
                            </CardActions>
                        </Card>
                    </Box>
                ))}
            </Box>

            <Modal open={modalData.open} onClose={handleCloseCoordinates}>
                <Box sx={style}>
                    <Typography sx={{ mb: 2, ml: 9 }}>
                        Update Coordinates of Survivor
                    </Typography>
                    <TextField
                        fullWidth
                        sx={{ mb: 2 }}
                        label="Latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                    />
                    <Button
                        sx={{ mt: 2, ml: 19 }}
                        onClick={() =>
                            updateSurvivorCoordinates(modalData.survivorId)
                        }
                        size="medium"
                        color="primary"
                        variant="contained"
                    >
                        Update
                    </Button>{" "}
                </Box>
            </Modal>

            <Modal open={openInfos} onClose={handleCloseInfos}>
                <Box sx={style}>
                    <Typography>
                        Percentage of infected survivors: {percentageInfected}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Percentage of healthy survivors: {percentageHealthy}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Water per survivor: {waterPerSurvivor}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Food per survivor: {foodPerSurvivor}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Medication per survivor: {medicationPerSurvivor}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Ammo per survivor: {ammoPerSurvivor}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Lost points: {lostPoints}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Remaining Points: {remainingPoints}
                    </Typography>
                </Box>
            </Modal>
        </>
    );
};

export default Survivors;
