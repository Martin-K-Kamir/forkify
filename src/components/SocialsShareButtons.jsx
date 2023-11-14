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
            label: "Facebook",
            icon: "facebook",
            component: FacebookShareButton,
        },
        {
            label: "Messenger",
            icon: "facebookMessenger",
            appId: META_APP_ID,
            component: FacebookMessengerShareButton,
        },
        {
            label: "Whatsapp",
            icon: "whatsapp",
            component: WhatsappShareButton,
        },
    ];

    const renderedSocialApps = socialApps.map(
        ({ label, icon, component, ...rest }) => {
            const Component = component;

            return (
                <Component
                    key={label}
                    url={window.location.href}
                    className="flex align-items-center gap-2xs"
                    {...rest}
                >
                    <Icon
                        type={icon}
                        className="f-size-2"
                        viewBox="0 0 48 48"
                    />
                    Share on {label}
                </Component>
            );
        }
    );

    return <>{renderedSocialApps}</>;
};

export default SocialsShareButtons;
