"use client";
import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import ProfileUpdate from "@/components/profile/ProfileUpdate";

const SidebarItems = [
    {
        sidebarTitle: "Profile",
        sideBarContent: <ProfileUpdate />,
        icon: "profile-icon",
    },
    {
        sidebarTitle: "Change Password",
        sideBarContent: "test2",
        icon: "change-password-icon",
    },
    {
        sidebarTitle: "Log Out",
        sideBarContent: "test3",
        icon: "logout-icon",
    }
];

export default function Sidebar() {
    const [isVertical, setIsVertical] = React.useState(true);

    return (

        <Tabs aria-label="Options" isVertical={isVertical}>
            {SidebarItems.map((item, index) => (
                <Tab key={index} title={item.sidebarTitle} className="w-full h-12">
                    <Card className="ml-10">
                        <CardBody className="bg-gray-59">
                            {item.sideBarContent}
                        </CardBody>
                    </Card>
                </Tab>
            ))}
        </Tabs>

    );
}
