import { Route, Routes } from "react-router-dom";
import CreateSurvivor from "./components/CreateSurvivor";
import ListSurvivors from "./components/ListSurvivors";
import PrivateRoute from "./components/PrivateRoute";
import TradesSurvivors from "./components/TradesSurvivors";
import { ApiConfig } from "./utils/api/api";
import { InitAuth } from "./utils/auth/initAuth";

const App = () => {
    return (
        <>
            <InitAuth />
            <ApiConfig />
            <Routes>
                <Route path="/" element={<PrivateRoute />}>
                    <Route index element={<ListSurvivors />} />
                    <Route path="/create" element={<CreateSurvivor />} />
                    <Route path="/trades" element={<TradesSurvivors />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
