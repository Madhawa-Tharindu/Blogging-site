import { Routes, Route } from 'react-router-dom'
import Navbar from "./components/navbar.component";

const App = () => {
    return (
        <Routes>
            //added Outlet component in NavBar for Nested Router component.
            <Route path="/" element={<Navbar />}>
                <Route path="/signin" element={<h1>Sign In Page</h1>} />
                <Route path="/signup" element={<h1>Sign Up Page</h1>} />
            </Route>
        </Routes>
    )
}

export default App;