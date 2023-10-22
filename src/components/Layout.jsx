import { Outlet } from "react-router-dom";
import Navigation from "./navigation/Navigation.jsx";

const Layout = () => {
    return (
        <div className="wrapper py-fluid-l-xl">
            <Navigation />

            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
