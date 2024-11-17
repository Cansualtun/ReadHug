import * as Yup from 'yup';

export const registerValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Geçerli bir email girin')
    .required('Email zorunludur'),
  firstName: Yup.string().required('İsim zorunludur'),
  lastName: Yup.string().required('Soyisim zorunludur'),
  userName: Yup.string().required('Kullanıcı adı zorunludur'),
  password: Yup.string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .required('Şifre zorunludur'),
});
