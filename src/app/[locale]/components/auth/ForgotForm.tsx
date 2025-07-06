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

const ForgotForm = () => {
  const t = useTranslations('ForgotForm');
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
      <CardHeader className="flex flex-col">
        <div className="flex flex-row items-center w-full justify-center">
          <Link href="/">
            <Image
              alt="nextui logo"
              src="/assets/favicon.svg"
              className="w-[70px] h-[48px]"
            />
          </Link>
          <div className="flex flex-col">
            <p className="text-md">{t('title')}</p>
          </div>
        </div>
        <div className="flex justify-center items-center w-full">
          <p className="text-small text-default-500 text-center">
            {t('subtitle')}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col items-center space-y-4">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full flex flex-col items-center space-y-4"
        >
          <div className="w-full">
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
          <div className='flex justify-between items-center w-full'>
            <Link href="/login" className="text-sm">
              {t('loginLink')}
            </Link>
            <Button
              type="submit"
              color="primary"
              disabled={isLoading || !formik.isValid || !formik.dirty}
              isLoading={isLoading}
            >
              {t('submitButton')}
            </Button>
          </div>
        </form>
      </CardBody>
      {/* <Divider />
      <CardFooter className="flex justify-between items-center"></CardFooter> */}
    </Card>
  );
};

export default ForgotForm;
