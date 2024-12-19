import * as Yup from 'yup';

export const requstValidationSchema = Yup.object().shape({
  title: Yup.string().required('Başlık zorunludur'),
  authors: Yup.string().required('Yazar zorunludur'),
});
