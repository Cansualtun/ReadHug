"use client"

import { Button } from "@nextui-org/button"
import { Card } from "@nextui-org/card"
import { Input } from "@nextui-org/input"

export default function ChangePassword() {
    return (
        <>
            <div className="flex flex-col gap-2 text-start ml-10 mt-4">
                <p>Change Password</p>
                <p className="font-light">You can change password this section</p>
            </div>
            <Card className="p-10 m-6">
                <form className="w-full flex flex-col gap-4">
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input
                            type="password"
                            variant="underlined"
                            label="Current Password"
                            name="firstName"
                            placeholder="Enter current password"
                            className="w-full"
                        />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input
                            type="password"
                            variant="underlined"
                            label="New Password"
                            name="lastName"
                            placeholder="Enter new password"
                            className="w-full"
                        />
                    </div>
                    <Button type="submit" className="mt-4 w-32" color="default">
                        Save Changes
                    </Button>
                </form>
            </Card>
        </>
    )
}