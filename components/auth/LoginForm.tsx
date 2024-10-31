"use client";
import { useFormik } from "formik";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Input, Button } from "@nextui-org/react";
import { useState } from "react";
import { EyeSlashFilledIcon } from "../ui/svg/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../ui/svg/EyeFilledIcon";
import { useLoginMutation } from "@/store/AuthStore";
import { useRouter } from "next/navigation";
import { loginValidationSchema } from "@/validations/loginValidations";
import toast from "react-hot-toast";

const LoginForm = () => {
    const [login, { isLoading }] = useLoginMutation();
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: loginValidationSchema,
        onSubmit: async (values) => {
            const { email, password } = values;
            await login({ email, password });
            router.push("/")
        },
    });

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <Card className="w-[400px] p-4">
            <CardHeader className="flex flex-col items-center">
                <p className="text-md">Login</p>
                <p className="text-small text-default-500">booksapp.org</p>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col items-center space-y-4">
                <form onSubmit={formik.handleSubmit} className="w-full flex flex-col items-center space-y-4">
                    <div className="w-full max-w-xs">
                        <Input
                            fullWidth
                            name="email"
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className="w-full max-w-xs">
                        <Input
                            fullWidth
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            type={isVisible ? "text" : "password"}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                    {isVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                        />
                    </div>
                    <Button
                        type="submit"
                        color="primary"
                        disabled={isLoading || !formik.isValid || !formik.dirty}
                        isLoading={isLoading}
                    >
                        Login
                    </Button>
                </form>
            </CardBody>
            <Divider />
            <CardFooter>
                <Link href="/register">Create Account</Link>
            </CardFooter>
        </Card>
    );
};

export default LoginForm;
