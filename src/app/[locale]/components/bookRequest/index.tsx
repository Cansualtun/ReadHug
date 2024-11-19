"use client"
import React, { useState, FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardBody } from '@nextui-org/card';
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
    const [imageUrl, setImageUrl] = useState<string>('');
    const [publishedDate, setPublishedDate] = useState<string>('');
    const [pageCount, setPageCount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isbns, setIsbns] = useState<string[]>(['']);

    const handleDynamicInputChange = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number,
        value: string
    ) => {
        setter((prevValues) => {
            const newValues = [...prevValues];
            newValues[index] = value;
            return newValues;
        });
    };

    const addDynamicInput = (
        setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setter((prevValues) => [...prevValues, '']);
    };

    const removeDynamicInput = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number
    ) => {
        setter((prevValues) => prevValues.filter((_, i) => i !== index));
    };

    const renderDynamicInputs = (
        values: string[],
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        placeholder: string,
        label: string
    ) => (
        <div className="space-y-2">
            {values.map((value, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleDynamicInputChange(setter, index, e.target.value)}
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
        const bookData: BookData = {
            title,
            authors: authors.filter(a => a.trim() !== ''),
            publishers: publishers.filter(p => p.trim() !== ''),
            categories: categories.filter(c => c.trim() !== ''),
            imageUrl,
            publishedDate: parseInt(publishedDate),
            pageCount: parseInt(pageCount),
            description,
            isbns: isbns.filter(isbn => isbn.trim() !== '')
        };
        console.log(bookData);
        // Burada veriyi backend'e gönderebilirsiniz
    };

    return (
        <div className='grid grid-cols-12 gap-6 p-2'>
            <div className='col-span-12 md:col-span-8 bg-default-100 shadow-md rounded-lg'>
                <div className="max-w-2xl mx-auto p-6 ">
                    <h2 className="text-2xl font-bold mb-6 text-center text-default-800">Kitap Talep Formu</h2>
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
                            {renderDynamicInputs(authors, setAuthors, 'Yazar adı', 'Yazar')}
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Yayınevleri</label>
                            {renderDynamicInputs(publishers, setPublishers, 'Yayınevi adı', 'Yayınevi')}
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Kategoriler</label>
                            {renderDynamicInputs(categories, setCategories, 'Kategori', 'Kategori')}
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Kitap Kapağı URL'si</label>
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
                                <label className="block mb-2 font-medium">Yayın Tarihi</label>
                                <input
                                    type="number"
                                    value={publishedDate}
                                    onChange={(e) => setPublishedDate(e.target.value)}
                                    placeholder="Yayın yılı"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">Sayfa Sayısı</label>
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
                            <label className="block mb-2 font-medium">ISBN Numaraları</label>
                            {renderDynamicInputs(isbns, setIsbns, 'ISBN numarası', 'ISBN')}
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                className="bg-primary/80 text-white px-6 py-2 rounded-md hover:bg-primary transition-colors"
                            >
                                Kitap Talebini Gönder
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='col-span-4 hidden md:flex'>
                <RequestSidebar />
            </div>

        </div>
    );
};

export default BookRequests;