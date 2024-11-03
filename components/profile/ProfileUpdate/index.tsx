"use client";
import { genderOptions } from "@/enums/gender";
import { useProfileUpdateMutation } from "@/store/ProfileStore";
import { useMeMutation } from "@/store/UserStore";
import { Button, Card, Input, Select, SelectItem } from "@nextui-org/react";
import { useFormik } from "formik";
import { useEffect } from "react";

export default function ProfileUpdate() {
    const [me, { isLoading }] = useMeMutation();
    const [updateProfile] = useProfileUpdateMutation();


    const formik = useFormik({
        initialValues: { firstName: "", lastName: "", userName: "", birthDate: "", gender: "" },
        onSubmit: async (values) => {
            try {
                await updateProfile(values);
            } catch (error) {
                console.error("Failed to update profile:", error);
            }
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            const data = await me();
            if (data) {
                formik.setValues({
                    firstName: data.data?.data.firstName || "",
                    lastName: data.data?.data.lastName || "",
                    userName: data.data?.data.userName || "",
                    birthDate: data.data?.data.birthDate || "",
                    gender: data.data?.data.gender || ""
                });
            }
        };
        fetchData();
    }, [me]);

    return (

        <Card className="p-10 m-10">
            <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4">
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                    <Input
                        type="text"
                        variant="underlined"
                        label="First Name"
                        name="firstName"
                        value={formik.values.firstName}
                        placeholder="Enter your first name"
                        className="w-full"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                    <Input
                        type="text"
                        variant="underlined"
                        label="Last Name"
                        name="lastName"
                        value={formik.values.lastName}
                        placeholder="Enter your last name"
                        className="w-full"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                    <Input
                        type="text"
                        variant="underlined"
                        label="Username"
                        name="userName"
                        value={formik.values.userName}
                        placeholder="Enter your username"
                        className="w-full"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                    <Input
                        type="date"
                        variant="underlined"
                        label="Birth Date"
                        name="birthDate"
                        value={formik.values.birthDate}
                        placeholder="Enter your birth date"
                        className="w-full"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                    <Select
                        label="Gender"
                        placeholder="Select Gender"
                        className="max-w-xs"
                    >
                        {genderOptions.map((item) => (
                            <SelectItem key={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <Button type="submit" disabled={isLoading} className="mt-4 w-32" color="default">
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </form >
        </Card>

    );
}


