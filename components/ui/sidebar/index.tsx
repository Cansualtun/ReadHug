"use client"
import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";


const SidebarItems = [
    {
        sidebarTitle: "Profile",
        sideBarContent: "test",
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
        <div className="flex flex-col px-4">
            <div className="flex w-full flex-col">
                <Tabs aria-label="Options" isVertical={isVertical}>
                    {SidebarItems.map((item, index) => (
                        <Tab key={index} title={item.sidebarTitle}>
                            <Card>
                                <CardBody>
                                    {item.sideBarContent}
                                </CardBody>
                            </Card>
                        </Tab>
                    ))}
                </Tabs>

            </div>
        </div>
    );
}
