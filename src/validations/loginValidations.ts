import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Geçerli bir email girin')
    .required('Email zorunludur'),
  password: Yup.string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .required('Şifre zorunludur'),
});
