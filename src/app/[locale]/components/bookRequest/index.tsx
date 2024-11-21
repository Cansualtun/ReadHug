'use client';
import { selectUser } from '@/store/UserStore/slice';
import { Button } from '@nextui-org/button';
import { CheckCircle, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { FormEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import LoginForm from '../auth/LoginForm';
import Loading from '../ui/loading';
import RequestSidebar from './RequestSidebar';

interface BookData {
  title: string;
  authors: string[];
  publishers: string[];
  categories: string[];
  imageUrl: string;
  publishedDate: number;
  pageCount: number;
  description: string;
  isbns: string[];
}

const BookRequests: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [authors, setAuthors] = useState<string[]>(['']);
  const [publishers, setPublishers] = useState<string[]>(['']);
  const [categories, setCategories] = useState<string[]>(['']);
  const [isbns, setIsbns] = useState<string[]>(['']);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [publishedDate, setPublishedDate] = useState<string>('');
  const [pageCount, setPageCount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const me = useSelector(selectUser);

  const clearStates = () => {
    setTitle('');
    setAuthors([""]);
    setPublishers([""]);
    setCategories([""]);
    setIsbns([""]);
    setImageUrl('');
    setPublishedDate('');
    setPageCount('');
    setDescription('');
  };

  const handleDynamicInputChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) => {
    setter((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
  };

  const addDynamicInput = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((prevValues) => [...prevValues, '']);
  };

  const removeDynamicInput = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) => {
    setter((prevValues) => prevValues.filter((_, i) => i !== index));
  };

  const renderDynamicInputs = (
    values: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    placeholder: string,
    label: string,
  ) => (
    <div className="space-y-2">
      {values.map((value, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            value={value}
            onChange={(e) =>
              handleDynamicInputChange(setter, index, e.target.value)
            }
            placeholder={placeholder}
            className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {values.length > 1 && (
            <button
              type="button"
              onClick={() => removeDynamicInput(setter, index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addDynamicInput(setter)}
        className="flex items-center text-primary hover:text-primary/80"
      >
        <Plus size={16} className="mr-2" /> {label} Ekle
      </button>
    </div>
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const bookData: BookData = {
      title,
      authors: authors.filter((a) => a.trim() !== ''),
      publishers: publishers.filter((p) => p.trim() !== ''),
      categories: categories.filter((c) => c.trim() !== ''),
      imageUrl,
      publishedDate: parseInt(publishedDate),
      pageCount: parseInt(pageCount),
      description,
      isbns: isbns.filter((isbn) => isbn.trim() !== ''),
    };

    try {
      console.log(bookData);
    } catch (error) {
      setIsSuccess(true);
      setLoading(false);
    }

    setIsSuccess(true);
    setLoading(false);
  };

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
                    {/* Success Icon */}
                    <div className="p-3 bg-green-500/20 rounded-full">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>

                    {/* Success Message */}
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

                    {/* Action Button */}
                    <div>
                      <Button
                        onClick={() => {
                          setIsSuccess(false);
                          clearStates()
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Kitap Adı *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Kitap başlığını giriniz"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Yazarlar *</label>
                  {renderDynamicInputs(
                    authors,
                    setAuthors,
                    'Yazar adı',
                    'Yazar',
                  )}
                </div>

                <div>
                  <label className="block mb-2 font-medium">Yayınevleri</label>
                  {renderDynamicInputs(
                    publishers,
                    setPublishers,
                    'Yayınevi adı',
                    'Yayınevi',
                  )}
                </div>

                <div>
                  <label className="block mb-2 font-medium">Kategoriler</label>
                  {renderDynamicInputs(
                    categories,
                    setCategories,
                    'Kategori',
                    'Kategori',
                  )}
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Kitap Kapağı URL'si
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
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
                      value={publishedDate}
                      onChange={(e) => setPublishedDate(e.target.value)}
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
                      value={pageCount}
                      onChange={(e) => setPageCount(e.target.value)}
                      placeholder="Toplam sayfa sayısı"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Açıklama</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Kitap açıklamasını giriniz"
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    ISBN Numaraları
                  </label>
                  {renderDynamicInputs(
                    isbns,
                    setIsbns,
                    'ISBN numarası',
                    'ISBN',
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary/80 text-white px-6 py-2 rounded-md hover:bg-primary transition-colors"
                  >
                    Kitap Talebini Gönder
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="col-span-12 md:col-span-8 rounded-lg">
          <div className="w-full h-full flex flex-col justify-start items-center">
            <div className="text-default-500 mb-10">
              <h3 className="text-2xl font-semibold">
                Kitap Talebi Oluşturma Formu
              </h3>
              <p>Kitap talebi oluşturabilmek için lütfen giriş yapın.</p>
            </div>
            <LoginForm />
          </div>
        </div>
      )}

      <div className="col-span-4 hidden md:flex">
        <RequestSidebar />
      </div>
    </div>
  );
};

export default BookRequests;
