"use client";

import { useProfileUpdateMutation } from "@/store/ProfileStore";
import { useMeMutation } from "@/store/UserStore";
import { formatDate } from "@/utils/formatDate";
import { Button, Card, CardHeader, Input, Select, SelectItem } from "@nextui-org/react";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useTranslations } from 'next-intl';
import { genderOptions } from "enums/gender";
import { User, Calendar, AtSign, UserCircle2 } from "lucide-react";

export default function ProfileUpdate() {
    const t = useTranslations('ProfileUpdate');
    const [me, { isLoading }] = useMeMutation();
    const [updateProfile] = useProfileUpdateMutation();

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            userName: "",
            birthDate: "",
            gender: 0
        },
        onSubmit: async (values) => {
            try {
                await updateProfile({
                    ...values,
                    birthDate: formatDate(values.birthDate)
                });
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
                    gender: data.data?.data.gender || 0
                });
            }
        };
        fetchData();
    }, [me]);

    return (
        <Card className="p-6 bg-default-100">
            <CardHeader>Profile Update</CardHeader>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="text"
                        variant="bordered"
                        label={t('form.firstName.label')}
                        name="firstName"
                        value={formik.values.firstName}
                        placeholder={t('form.firstName.placeholder')}
                        startContent={<User className="w-4 h-4 text-default-400" />}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <Input
                        type="text"
                        variant="bordered"
                        label={t('form.lastName.label')}
                        name="lastName"
                        value={formik.values.lastName}
                        placeholder={t('form.lastName.placeholder')}
                        startContent={<User className="w-4 h-4 text-default-400" />}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <Input
                    type="text"
                    variant="bordered"
                    label={t('form.userName.label')}
                    name="userName"
                    value={formik.values.userName}
                    placeholder={t('form.userName.placeholder')}
                    startContent={<AtSign className="w-4 h-4 text-default-400" />}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="date"
                        variant="bordered"
                        label={t('form.birthDate.label')}
                        name="birthDate"
                        value={formatDate(formik.values.birthDate)}
                        placeholder={t('form.birthDate.placeholder')}
                        startContent={<Calendar className="w-4 h-4 text-default-400" />}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <Select
                        variant="bordered"
                        label={t('form.gender.label')}
                        placeholder={t('form.gender.placeholder')}
                        startContent={<UserCircle2 className="w-4 h-4 text-default-400" />}
                        selectedKeys={[formik.values.gender.toString()]}
                        onChange={(e) => formik.setFieldValue('gender', parseInt(e.target.value))}
                    >
                        {genderOptions.map((item) => (
                            <SelectItem key={item.value.toString()} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        color="primary"
                        className="px-8"
                        size="md"
                    >
                        {t('form.submit.default')}
                    </Button>
                </div>
            </form>
        </Card>

    );
}