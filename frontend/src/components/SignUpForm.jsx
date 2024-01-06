import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import api from "../utils/api/api";

export default function SignUpForm() {
    const { register, handleSubmit, control } = useForm();

    const createSurvivor = async (
        name,
        email,
        age,
        gender,
        latitude,
        longitude,
        password,
        birth_date,
        water,
        food,
        medication
    ) => {
        await api
            .post("/api/v1/register/", {
                survivor: {
                    name,
                    email,
                    password,
                    age,
                    gender,
                    latitude,
                    longitude,
                    birth_date,
                },
                inventory: {
                    items: {
                        water,
                        food,
                        medication,
                    },
                },
            })
            .then((response) => {
                console.log(response.status);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const onSubmit = async (event, data) => {
        event.preventDefault();
        createSurvivor(
            data.name,
            data.email,
            data.age,
            data.gender,
            data.latitude,
            data.longitude,
            data.password,
            data.birth_date,
            data.water,
            data.food,
            data.medication
        );
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ mt: 3 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="name"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                                {...register("name")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="age"
                                label="Age"
                                name="age"
                                type="number"
                                {...register("age")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="latitude"
                                required
                                fullWidth
                                id="latitude"
                                label="Latitude"
                                type="number"
                                {...register("latitude")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="longitude"
                                label="Longitude"
                                name="longitude"
                                type="number"
                                {...register("longitude")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                control={control}
                                name="ReactDatepicker"
                                defaultValue=""
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Gender</InputLabel>
                                        <Select
                                            label="Gender"
                                            required
                                            defaultValue=""
                                            {...field}
                                        >
                                            <MenuItem value="M">Male</MenuItem>
                                            <MenuItem value="F">
                                                Female
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="water quantity"
                                label="Water Quantity"
                                name="water quantity"
                                type="number"
                                {...register("water")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="food quantity"
                                label="Food Quantity"
                                name="food quantity"
                                type="number"
                                {...register("food")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="medication quantity"
                                label="Medication Quantity"
                                name="medication quantity"
                                type="number"
                                {...register("medication")}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                name="birth date"
                                required
                                fullWidth
                                id="birth date"
                                label="Birth date"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...register("birth_date")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                type="email"
                                {...register("email")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                {...register("password")}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2">
                                Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
