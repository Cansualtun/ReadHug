'use client';

import { selectUser } from '@/store/UserStore/slice';
import { requstValidationSchema } from '@/validations/requestValidations';
import { Button } from '@nextui-org/button';
import { useFormik } from 'formik';
import { CheckCircle, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import LoginForm from '../auth/LoginForm';
import Loading from '../ui/loading';
import RequestSidebar from './RequestSidebar';
import { createBookRequestClient } from '../../client/request';

const BookRequests: React.FC = () => {
  const me = useSelector(selectUser);

  const formik: any = useFormik({
    initialValues: {
      title: '',
      authors: [''],
      publishers: [''],
      categories: [''],
      isbns: [''],
      imageUrl: '',
      publishedDate: '',
      pageCount: '',
      description: '',
    },
    // validationSchema: requstValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      
      try {
        setLoading(true);
        await createBookRequestClient(values);
        setIsSuccess(true);
        resetForm();
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    },
  });

  const [loading, setLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const addDynamicInput = (field: string) => {
    formik.setFieldValue(field, [...formik.values[field], '']);
  };

  const removeDynamicInput = (field: string, index: number) => {
    formik.setFieldValue(
      field,
      formik.values[field].filter((_: string, i: number) => i !== index),
    );
  };

  const renderDynamicInputs = (
    field: string,
    placeholder: string,
    label: string,
  ) => (
    <div className="space-y-2">
      {formik.values[field]?.map((value: string, index: number) => {
        return (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={formik.values[field][index]}
              onChange={(e) => {
                const updatedValues = [...formik.values[field]];
                updatedValues[index] = e.target.value;
                formik.setFieldValue(field, updatedValues);
              }}
              placeholder={placeholder}
              className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {formik.values[field].length > 1 && (
              <button
                type="button"
                onClick={() => removeDynamicInput(field, index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => addDynamicInput(field)}
        className="flex items-center text-primary hover:text-primary/80"
      >
        <Plus size={16} className="mr-2" /> {label} Ekle
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-6 p-2">
      {me ? (
        <div className="col-span-12 md:col-span-8 bg-default-100 shadow-md rounded-lg relative">
          {loading && (
            <div className="absolute w-full h-full bg-primary/20 flex justify-center items-center">
              <Loading />
            </div>
          )}
          {isSuccess ? (
            <div className="w-full h-full flex justify-center items-center p-6">
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md p-6 mx-4 bg-default-100">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-3 bg-green-500/20 rounded-full">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-semibold text-default-800">
                        Talebiniz Alındı!
                      </h2>
                      <p className="text-default-600">
                        Kitap ekleme talebiniz gönderilmiştir.
                      </p>
                      <p className="text-default-600">
                        En kısa sürede kitap ile ilgili bildirim alacaksınız.
                      </p>
                    </div>
                    <div>
                      <Button
                        onClick={() => {
                          setIsSuccess(false);
                        }}
                        className="mt-6 px-8 py-3 bg-primary rounded-lg hover:bg-primary/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-white"
                      >
                        Yeni Talep Oluştur
                      </Button>
                      <Link
                        href={'/'}
                        className="mt-6 px-8 py-3 transition-colors duration-200 focus:outline-none text-primary hover:text-primary/80"
                      >
                        Ana Sayfa
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto p-6 ">
              <h2 className="text-2xl font-bold mb-6 text-center text-default-800">
                Kitap Talep Formu
              </h2>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Kitap Adı *</label>
                  <input
                    type="text"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="title"
                    required
                    placeholder="Kitap başlığını giriniz"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Yazarlar *</label>
                  {renderDynamicInputs('authors', 'Yazar adı', 'Yazar')}
                </div>

                <div>
                  <label className="block mb-2 font-medium">Yayınevleri</label>
                  {renderDynamicInputs(
                    'publishers',
                    'Yayınevi adı',
                    'Yayınevi',
                  )}
                </div>

                <div>
                  <label className="block mb-2 font-medium">Kategoriler</label>
                  {renderDynamicInputs('categories', 'Kategori', 'Kategori')}
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Kitap Kapağı URL'si
                  </label>
                  <input
                    type="url"
                    value={formik.values.imageUrl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="imageUrl"
                    placeholder="Kitap kapağı URL'sini giriniz"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium">
                      Yayın Tarihi
                    </label>
                    <input
                      type="number"
                      value={formik.values.publishedDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="publishedDate"
                      placeholder="Yayın yılı"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">
                      Sayfa Sayısı
                    </label>
                    <input
                      type="number"
                      value={formik.values.pageCount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="pageCount"
                      placeholder="Toplam sayfa sayısı"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    ISBN Numaraları
                  </label>
                  {renderDynamicInputs('isbns', 'ISBN numarası', 'ISBN')}
                </div>

                <div>
                  <label className="block mb-2 font-medium">Açıklama</label>
                  <textarea
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="description"
                    placeholder="Kitap açıklamasını giriniz"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-primary rounded-lg text-white hover:bg-primary/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Talebi Gönder
                  </button>
                  <button
                    type="button"
                    onClick={formik.handleReset}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-200 rounded-lg text-default-700 hover:bg-gray-300 transition-colors duration-200 focus:outline-none"
                  >
                    Temizle
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="col-span-12 md:col-span-8 flex justify-center items-center p-6">
          <div>
            <p className="text-lg font-medium text-default-800 mb-4">
              Talep oluşturabilmek için giriş yapmanız gerekiyor.
            </p>
            <LoginForm />
          </div>
        </div>
      )}
      <div className="col-span-12 md:col-span-4">
        <RequestSidebar />
      </div>
    </div>
  );
};

export default BookRequests;
