'use client';
import { useFormik } from 'formik';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Input,
  Button,
  Image,
} from '@nextui-org/react';
import { useState } from 'react';
import { EyeSlashFilledIcon } from '../ui/svg/EyeSlashFilledIcon';
import { EyeFilledIcon } from '../ui/svg/EyeFilledIcon';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/store/AuthStore';
import { loginValidationSchema } from '@/validations/loginValidations';
import { useTranslations } from 'next-intl';

const LoginForm = () => {
  const t = useTranslations('LoginForm');
  const [login, { isLoading }] = useLoginMutation();
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        const { email, password } = values;
        const result = await login({ email, password }).unwrap();
        if (result.status) {
          router.push('/');
        }
      } catch (error) {}
    },
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Card className="w-[400px] p-4">
      <CardHeader>
        <div className="flex flex-row w-full justify-center">
          <Link href="/">
            <Image
              alt="nextui logo"
              src="/assets/favicon.svg"
              className="w-[70px] h-[48px]"
            />
          </Link>
          <div className="flex flex-col">
            <p className="text-md">{t('title')}</p>
            <Link href="/" className="text-small text-default-500">
              {t('subtitle')}
            </Link>
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col items-center space-y-4">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full flex flex-col items-center space-y-4"
        >
          <div className="w-full max-w-xs">
            <Input
              fullWidth
              name="email"
              label={t('email.label')}
              placeholder={t('email.placeholder')}
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
              label={t('password.label')}
              placeholder={t('password.placeholder')}
              type={isVisible ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
            />
          </div>
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
        <Link href="/register" className="text-sm">
          {t('createAccount')}
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
