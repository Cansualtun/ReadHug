'use client';

import { useProfileUpdateMutation } from '@/store/ProfileStore';
import { useMeMutation } from '@/store/UserStore';
import {
  Button,
  Card,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import { genderOptions } from 'enums/gender';
import { useFormik } from 'formik';
import { AtSign, Calendar, TextSelect, User, UserCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ProfileUpdate() {
  const t = useTranslations('ProfileUpdate');
  const [me, { isLoading }] = useMeMutation();
  const [updateProfile] = useProfileUpdateMutation();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      userName: '',
      birthDate: '',
      gender: 0,
      bio: '',
    },
    onSubmit: async (values) => {
      try {
        await updateProfile({
          ...values,
          birthDate: values.birthDate,
        });
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await me();
      if (data) {
        formik.setValues({
          firstName: data.data?.data.firstName || '',
          lastName: data.data?.data.lastName || '',
          userName: data.data?.data.userName || '',
          birthDate: data.data?.data.birthDate.split('T')[0] || '',
          gender: data.data?.data.gender || 0,
          bio: data.data?.data.bio || '',
        });
      }
    };
    fetchData();
  }, [me]);

  return (
    <Card shadow="sm" className="p-6 bg-default-100">
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
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            variant="bordered"
            label={t('form.birthDate.label')}
            name="birthDate"
            value={formik.values.birthDate}
            defaultValue={formik.values.birthDate}
            placeholder={t('form.birthDate.placeholder')}
            startContent={<Calendar className="w-4 h-4 text-default-400" />}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
          />
          <Select
            variant="bordered"
            label={t('form.gender.label')}
            placeholder={t('form.gender.placeholder')}
            startContent={<UserCircle2 className="w-4 h-4 text-default-400" />}
            selectedKeys={[formik.values.gender.toString()]}
            onChange={(e) =>
              formik.setFieldValue('gender', parseInt(e.target.value))
            }
          >
            {genderOptions.map((item) => (
              <SelectItem key={item.value.toString()} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 relative">
          <div className="absolute right-0 top-0 bg-default-200 px-2 py-0.5 rounded-tr-lg rounded-bl-lg text-sm">
            {formik.values.bio.length} / 256
          </div>
          <Textarea
            variant="bordered"
            label={t('form.bio.label')}
            placeholder={t('form.bio.placeholder')}
            startContent={<TextSelect className="w-4 h-4 text-default-400" />}
            value={formik.values.bio}
            onValueChange={(e) => {
              if (e.length <= 256) {
                formik.setFieldValue('bio', e);
              } else {
                toast.error('Biyografiniz 256 karakterden fazla olamaz.');
              }
            }}
            onBlur={formik.handleBlur}
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
            {t('form.submit.default')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
