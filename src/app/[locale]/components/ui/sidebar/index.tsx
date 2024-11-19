"use client";
import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { User2, KeyRound } from "lucide-react";
import ProfileUpdate from "../../profile/ProfileUpdate";
import ChangePassword from "../../profile/ChangePassword";

const SidebarItems = [
    {
        sidebarTitle: "Profile",
        sideBarContent: <ProfileUpdate />,
        icon: <User2 className="w-5 h-5" />,
        description: "Personal information and settings",
        color: "primary"
    },
    {
        sidebarTitle: "Change Password",
        sideBarContent: <ChangePassword />,
        icon: <KeyRound className="w-5 h-5" />,
        description: "Update your password",
        color: "default"
    },
];

export default function Sidebar() {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <Tabs
                aria-label="Options"
                color="primary"
                variant="solid"
                classNames={{
                    tabList: "gap-4 p-2 bg-default-100 rounded-lg",
                    cursor: "bg-white dark:bg-default-100",
                    tab: "h-14 px-8 data-[selected=true]:text-primary",
                    tabContent: "group-data-[selected=true]:text-primary"
                }}
            >
                {SidebarItems.map((item, index) => (
                    <Tab
                        key={index}
                        title={
                            <div className="flex items-center gap-2">
                                {item.icon}
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-sm font-medium">{item.sidebarTitle}</span>
                                    <span className="text-xs text-default-500">{item.description}</span>
                                </div>
                            </div>
                        }
                    >
                        {item.sideBarContent}
                    </Tab>
                ))}
            </Tabs>
        </div>
    );
}