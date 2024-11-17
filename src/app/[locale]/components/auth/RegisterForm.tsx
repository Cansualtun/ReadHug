"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input, Button } from "@nextui-org/react";
import { EyeFilledIcon } from "../ui/svg/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../ui/svg/EyeSlashFilledIcon";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/store/AuthStore";
import { registerValidationSchema } from "@/validations/registerValidations";
import { useTranslations } from 'next-intl';

export default function RegisterForm() {
    const t = useTranslations('RegisterForm');
    const [isVisible, setIsVisible] = useState(false);
    const [register, { isLoading }] = useRegisterMutation();
    const router = useRouter();
    const toggleVisibility = () => setIsVisible(!isVisible);

    const formik = useFormik({
        initialValues: { email: "", password: "", firstName: "", lastName: "", userName: "" },
        validationSchema: registerValidationSchema,
        onSubmit: async (values) => {
            const { email, password, firstName, lastName, userName } = values;
            await register({ email, password, firstName, lastName, userName });
            router.push("/")
        },
    });

    return (
        <Card className="w-[400px] p-4">
            <CardHeader>
                <div className="flex flex-row w-full justify-center space-x-4">
                    <Image
                        alt="nextui logo"
                        height={40}
                        radius="sm"
                        src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                        width={40}
                    />
                    <div className="flex flex-col">
                        <p className="text-md">{t('title')}</p>
                        <p className="text-small text-default-500">{t('subtitle')}</p>
                    </div>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col items-center space-y-4">
                <form onSubmit={formik.handleSubmit} className="w-full flex flex-col items-center space-y-4">
                    <Input
                        type="email"
                        name="email"
                        label={t('email.label')}
                        placeholder={t('email.placeholder')}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        className="max-w-xs"
                    />
                    <Input
                        type="text"
                        name="firstName"
                        label={t('firstName.label')}
                        placeholder={t('firstName.placeholder')}
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        className="max-w-xs"
                    />
                    <Input
                        type="text"
                        name="lastName"
                        label={t('lastName.label')}
                        placeholder={t('lastName.placeholder')}
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        className="max-w-xs"
                    />
                    <Input
                        type="text"
                        name="userName"
                        label={t('userName.label')}
                        placeholder={t('userName.placeholder')}
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                        className="max-w-xs"
                    />
                    <Input
                        label={t('password.label')}
                        name="password"
                        placeholder={t('password.placeholder')}
                        fullWidth
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        endContent={
                            <button
                                className="focus:outline-none"
                                type="button"
                                onClick={toggleVisibility}
                                aria-label={t('togglePassword.ariaLabel')}
                            >
                                {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={isVisible ? "text" : "password"}
                        className="max-w-xs"
                    />
                    <Button
                        type="submit"
                        color="primary"
                        disabled={isLoading || !formik.isValid || !formik.dirty}
                        isLoading={isLoading}
                    >
                        {t('submitButton')}
                    </Button>
                </form>
            </CardBody>
            <Divider />
            <CardFooter>
                <Link href="/login">{t('loginLink')}</Link>
            </CardFooter>
        </Card>
    );
}