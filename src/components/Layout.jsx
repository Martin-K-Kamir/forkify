import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";

const Layout = () => {
    return (
        <div className="wrapper py-fluid-l-xl">
            <Header />

            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
