import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";

const Layout = () => {
    return (
        <div className="wrapper pt-fluid-m-l pb-2xl pb-xl//above-sm py-fluid-m-l//above-md">
            <Header />

            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
