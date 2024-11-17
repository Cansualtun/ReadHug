"use client";
import { useProfileUpdateMutation } from "@/store/ProfileStore";
import { useMeMutation } from "@/store/UserStore";
import { formatDate } from "@/utils/formatDate";
import { Button, Card, Input, Select, SelectItem } from "@nextui-org/react";
import { useFormik } from "formik";
import { useEffect } from "react";
import { genderOptions } from "../../../../enums/gender";
import { useTranslations } from 'next-intl';

export default function ProfileUpdate() {
    const t = useTranslations('ProfileUpdate');
    const [me, { isLoading }] = useMeMutation();
    const [updateProfile] = useProfileUpdateMutation();

    const formik = useFormik({
        initialValues: { firstName: "", lastName: "", userName: "", birthDate: "", gender: 0 },
        onSubmit: async (values) => {
            try {
                const formattedValues = {
                    ...values,
                    birthDate: formatDate(values.birthDate)
                };

                await updateProfile(formattedValues);
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
        <>
            <div className="flex flex-col gap-2 text-start ml-10 mt-4">
                <p>{t('header.title')}</p>
                <p className="font-light">{t('header.description')}</p>
            </div>
            <Card className="p-10 m-6">
                <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4">
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input
                            type="text"
                            variant="underlined"
                            label={t('form.firstName.label')}
                            name="firstName"
                            value={formik.values.firstName}
                            placeholder={t('form.firstName.placeholder')}
                            className="w-full"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input
                            type="text"
                            variant="underlined"
                            label={t('form.lastName.label')}
                            name="lastName"
                            value={formik.values.lastName}
                            placeholder={t('form.lastName.placeholder')}
                            className="w-full"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input
                            type="text"
                            variant="underlined"
                            label={t('form.userName.label')}
                            name="userName"
                            value={formik.values.userName}
                            placeholder={t('form.userName.placeholder')}
                            className="w-full"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input
                            type="date"
                            variant="underlined"
                            label={t('form.birthDate.label')}
                            name="birthDate"
                            value={formatDate(formik.values.birthDate)}
                            placeholder={t('form.birthDate.placeholder')}
                            className="w-full"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Select
                            label={t('form.gender.label')}
                            placeholder={t('form.gender.placeholder')}
                        >
                            {genderOptions.map((item) => (
                                <SelectItem key={item.value.toString()} value={item.value.toString()}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <Button type="submit" disabled={isLoading} className="mt-4 w-32" color="default">
                        {isLoading ? t('form.submit.saving') : t('form.submit.default')}
                    </Button>
                </form>
            </Card>
        </>
    );
}