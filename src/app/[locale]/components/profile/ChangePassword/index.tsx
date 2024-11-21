"use client"
import { useChangePasswordMutation } from "@/store/AuthStore"
import { Button } from "@nextui-org/button"
import { Card, CardHeader } from "@nextui-org/card"
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
        <Card shadow="sm" className="p-6 bg-default-100">
            <CardHeader>Change Password</CardHeader>
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
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        color="primary"
                        className="px-8"
                        size="md"
                    >
                        {t('form.submit')}
                    </Button>
                </div>
            </form>
        </Card>
    )
}