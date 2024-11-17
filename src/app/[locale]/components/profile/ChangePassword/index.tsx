"use client"
import { useChangePasswordMutation } from "@/store/AuthStore"
import { Button } from "@nextui-org/button"
import { Card } from "@nextui-org/card"
import { Input } from "@nextui-org/input"
import { useFormik } from "formik"
import { useTranslations } from 'next-intl';

export default function ChangePassword() {
    const t = useTranslations('ChangePassword');
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
                <p>{t('header.title')}</p>
                <p className="font-light">{t('header.description')}</p>
            </div>
            <Card className="p-10 m-6">
                <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4">
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input
                            type="password"
                            variant="underlined"
                            label={t('form.currentPassword.label')}
                            name="oldPassword"
                            placeholder={t('form.currentPassword.placeholder')}
                            className="w-full"
                            value={formik.values.oldPassword}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input
                            type="password"
                            variant="underlined"
                            label={t('form.newPassword.label')}
                            name="newPassword"
                            placeholder={t('form.newPassword.placeholder')}
                            className="w-full"
                            value={formik.values.newPassword}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-32"
                        color="default"
                    >
                        {t('form.submit')}
                    </Button>
                </form>
            </Card>
        </>
    )
}