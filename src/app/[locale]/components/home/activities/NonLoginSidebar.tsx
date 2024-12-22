'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { Book, User, Pen } from 'lucide-react';
import { getRecommendedBooks } from '@/app/[locale]/client/book';

const NonLoginSidebar = () => {
  const [recommendedBooks, setRecommendedBooks] = useState<any>([]);

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      await getRecommendedBooks().then((res) => {
        if (res.status) {
          setRecommendedBooks(res.data);
        }
      });
    };
    fetchRecommendedBooks();
  }, []);
  return (
    <div className="w-full max-h-fit pt-0 p-4 space-y-4">
      {/* Books Section */}
      <Card className="bg-default-100 shadow-sm">
        <CardHeader className="flex items-center space-x-2 pb-2 border-b">
          <Book className="w-5 h-5" />
          <h2 className="font-semibold">Sok Eklenen Kitaplar</h2>
        </CardHeader>
        <CardBody className="space-y-2">
          {recommendedBooks.map((book: any) => (
            <div
              key={book.id}
              className="flex space-x-3 px-2 hover:bg-default-100 rounded"
            >
              <img
                src={
                  book?.bookId?.images?.thumbnail ||
                  '/assets/book-placeholder.png'
                }
                alt={book?.bookId?.name}
                className="w-8 h-12 object-cover rounded"
              />
              <div className="flex flex-col justify-center">
                <p className="font-medium">{book?.bookId?.name}</p>
                <p className="text-sm text-gray-600">
                  {book?.bookId?.authors.map((i: any) => i.name).join(' & ')}
                </p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Authors Section */}
      <Card className="bg-default-100 shadow-sm">
        <CardHeader className="flex items-center space-x-2 pb-2 border-b">
          <Pen className="w-5 h-5" />
          <h2 className="font-semibold">Önerilen Yazarlar</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          {recommendedAuthors.map((author) => (
            <div
              key={author.id}
              className="flex items-center space-x-3 px-2 hover:bg-default-100 rounded"
            >
              <img
                src={author.imageUrl}
                alt={author.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{author.name}</p>
                <p className="text-sm text-gray-600">{author.genre}</p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Users Section */}
      {/* <Card className="bg-default-100 shadow-sm">
        <CardHeader className="flex items-center space-x-2 border-b">
          <User className="w-5 h-5" />
          <h2 className="font-semibold">Önerilen Kullanıcılar</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          {recommendedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 px-2 hover:bg-default-100 rounded"
            >
              <img
                src={user.imageUrl}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">
                  {user.readCount} kitap okudu
                </p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card> */}
    </div>
  );
};

export default NonLoginSidebar;

const recommendedBooks = [
  {
    id: 1,
    title: 'Suç ve Ceza',
    author: 'Dostoyevski',
    imageUrl: '/assets/book-placeholder.png',
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    imageUrl: '/assets/book-placeholder.png',
  },
  {
    id: 3,
    title: 'Simyacı',
    author: 'Paulo Coelho',
    imageUrl: '/assets/book-placeholder.png',
  },
];

const recommendedAuthors = [
  {
    id: 1,
    name: 'Sabahattin Ali',
    genre: 'Roman',
    imageUrl: '/assets/avatar.png',
  },
  {
    id: 2,
    name: 'Orhan Pamuk',
    genre: 'Roman',
    imageUrl: '/assets/avatar.png',
  },
  {
    id: 3,
    name: 'Oğuz Atay',
    genre: 'Modern Edebiyat',
    imageUrl: '/assets/avatar.png',
  },
];

const recommendedUsers = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    readCount: 120,
    imageUrl: '/assets/avatar.png',
  },
  {
    id: 2,
    name: 'Ayşe Demir',
    readCount: 85,
    imageUrl: '/assets/avatar.png',
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    readCount: 95,
    imageUrl: '/assets/avatar.png',
  },
];
