import { Link } from "react-router-dom";
import { capitalazeForEach } from "../utilities.js";

const Breadcrumbs = ({ breadcrumbs }) => {

    return (
        <div className="breadcrumbs">
            {breadcrumbs.map((breadcrumb, index) => (
                <span key={index}>
                    <Link to={breadcrumb.link}>{capitalazeForEach(breadcrumb.name)}</Link>
                    {index < breadcrumbs.length - 1 && <i className="fas fa-chevron-right"></i>}
                </span>
            ))}
        </div>
    )
}

export default Breadcrumbs;