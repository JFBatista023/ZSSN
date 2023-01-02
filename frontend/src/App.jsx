import { Route, Routes } from "react-router-dom";
import Survivors from "./components/Survivors";

const App = () => {
    return (
        <Routes>
            <Route path="/survivors">
                <Route index element={<Survivors />}/>
            </Route>
        </Routes>
    );
};

export default App;
