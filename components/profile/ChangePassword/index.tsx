"use client"

import { useChangePasswordMutation } from "@/store/AuthStore"
import { Button } from "@nextui-org/button"
import { Card } from "@nextui-org/card"
import { Input } from "@nextui-org/input"
import { useFormik } from "formik"

export default function ChangePassword() {
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const formik = useFormik({
        initialValues: { oldPassword: "", newPassword: "" },
        onSubmit: async (values) => {
            await changePassword(values)
            formik.resetForm();
        }
    })
    return (
        <>
            <div className="flex flex-col gap-2 text-start ml-10 mt-4">
                <p>Change Password</p>
                <p className="font-light">You can change password this section</p>
            </div>
            <Card className="p-10 m-6">
                <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4">
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input
                            type="password"
                            variant="underlined"
                            label="Current Password"
                            name="oldPassword"
                            placeholder="Enter current password"
                            className="w-full"
                            value={formik.values.oldPassword}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input
                            type="password"
                            variant="underlined"
                            label="New Password"
                            name="newPassword"
                            placeholder="Enter new password"
                            className="w-full"
                            value={formik.values.newPassword}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <Button type="submit" disabled={isLoading} className="mt-4 w-32" color="default">
                        Save Changes
                    </Button>
                </form>
            </Card>
        </>
    )
}