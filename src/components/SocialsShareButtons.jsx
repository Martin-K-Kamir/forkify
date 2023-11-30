import {
    FacebookMessengerShareButton,
    FacebookShareButton,
    WhatsappShareButton,
} from "react-share";
import Icon from "./Icon.jsx";
import { META_APP_ID } from "../env.js";
import React from "react";

const SocialsShareButtons = () => {
    const socialApps = [
        {
            content: "Facebook",
            icon: "facebook",
            component: FacebookShareButton,
        },
        {
            content: "Messenger",
            icon: "facebookMessenger",
            appId: META_APP_ID,
            component: FacebookMessengerShareButton,
        },
        {
            content: "Whatsapp",
            icon: "whatsapp",
            component: WhatsappShareButton,
        },
    ];

    const renderedSocialApps = socialApps.map(
        ({ content, icon, component, ...rest }) => {
            const Component = component;

            return (
                <Component
                    key={content}
                    {...rest}
                    url={window.location.href}
                    className="button flex text-gray-800 text-zinc-050//dark align-items-center gap-2xs radius-1"
                    data-variant="text"
                    style={{ padding: "", background: "", color: "" }} // reset inline styles from react-share
                >
                    <Icon
                        type={icon}
                        className="f-size-2"
                        viewBox="0 0 48 48"
                    />
                    Share on {content}
                </Component>
            );
        }
    );

    return <>{renderedSocialApps}</>;
};

export default SocialsShareButtons;
