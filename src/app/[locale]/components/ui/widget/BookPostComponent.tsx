'use client';
import { useGetUserBookSearchMutation } from '@/store/BookStore';
import { usePostShareMutation } from '@/store/PostStore';
import { Avatar, Button, Card, Input, Textarea } from '@nextui-org/react';
import axios from 'axios';
import { CircleX } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
interface BookPostComponentProps {
  userData: any; // Replace 'any' with the actual type of userData
}
interface Book {
  id: string;
  name: string;
  book_img: string;
  authorData: any;
}

const BookPostComponent: React.FC<BookPostComponentProps> = ({ userData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [books, setBooks] = useState<any>([]);
  const [postShare] = usePostShareMutation();
  const [getUserBookSearch] = useGetUserBookSearchMutation();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setSearchTerm('');
  };
  // submit etme fonksiyonumuz
  const handleSubmit = async () => {
    if (!selectedBook || !content) {
      toast.error('Kitap veya yorum seçilmedi');
      return;
    }
    await postShare({
      bookId: selectedBook._id,
      content: content,
    });
    setSelectedBook(null);
    setContent('');
    setIsExpanded(false);
  };

  // scroll yaptığımızda kapatma ve açma
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 0) {
        setIsExpanded(false);
        setHasScrolled(true);
      } else {
        setIsExpanded(true);
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  // handleClickOutside tanımladım kutu dışına tıklayınca kapanır
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (hasScrolled && isExpanded) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, hasScrolled]);

  const getAllBook = async (search: string) => {
    if (!search) {
      return;
    }
    try {
      const payload: any = {
        userName: userData.userName,
        queries: {
          search
        }
      }
      const { data } = await getUserBookSearch(payload)
      setBooks(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      getAllBook(searchTerm);
    }
  }, [searchTerm]);

  return (
    <Card
      shadow="sm"
      ref={containerRef}
      className={`relative w-full p-2 bg-default-50 dark:bg-default-200 transition-all ${isExpanded ? 'h-auto' : 'h-[56px] overflow-hidden'}`}
    >
      <div className="flex justify-between w-full mb-0">
        <Input
          type="text"
          placeholder="Kitaplarınızda arayın..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          onFocus={() => setIsExpanded(true)}
          className="mb-2 mr-4"
        />
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-end text-right">
            <p className="text-md font-semibold">{userData?.userName}</p>
            <p className="text-xs text-default-800">
              {userData?.firstName + ' ' + userData?.lastName}
            </p>
          </div>
          <Avatar
            src={userData?.image ?? '/assets/avatar.png'}
            size="md"
            className="bg-primary border-2 border-white shadow-md"
          />
        </div>
      </div>

      {isExpanded && searchTerm && books.length > 0 && (
        <div className="bg-default-100  border border-default-200 text-default-900 rounded-lg shadow-md max-h-40 overflow-y-auto mb-4 transition-all absolute top-[52px] z-50 w-full max-w-lg divide-y-1 divide-default-200">
          {books.map((book: any) => (
            <div
              key={book?._id}
              className="p-2 hover:bg-default-200  cursor-pointer flex"
              onClick={() => handleBookSelect(book)}
            >
              <div>
                <Image
                  className="rounded-lg border-2 shadow-sm"
                  src={book?.book?.book_img ?? '/assets/avatar.png'}
                  alt={book?.book?.name}
                  width={32}
                  height={64}
                />
              </div>
              <div className="ml-4">
                <p>{book?.book?.name}</p>
                <p>{book?.author?.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isExpanded && selectedBook && (
        <Card className="mb-2 pl-4 flex flex-row items-start p-2 relative bg-default-100">
          <div role='button' className='absolute top-2 right-2' onClick={() => setSelectedBook(null)}>
            <CircleX className='text-primary' />
          </div>
          <div>
            <Image
              className="rounded-lg border-2 shadow-sm"
              src={selectedBook?.book?.book_img ?? '/assets/avatar.png'}
              alt={selectedBook?.bookName}
              width={64}
              height={128}
            />
          </div>
          <div className="ml-4 text-small flex flex-col items-start justify-start">
            <div className='flex items-start mr-2'>
              <p className='font-semibold min-w-[90px]'>Kitap Adı</p>
              <p className=''> : {selectedBook?.bookName}</p>
            </div>

            <div className='flex items-start mr-2'>
              <p className='font-semibold min-w-[90px]'>Yazar</p>
              <p className=''> : {selectedBook?.author?.name}</p>
            </div>
            {
              selectedBook?.book?.pages_count && <div className='flex items-start mr-2'>
                <p className='font-semibold  min-w-[90px]'>Sayfa Sayısı</p>
                <p className=''> : {selectedBook?.book?.pages_count}</p>
              </div>
            }

            {/* <div className='flex items-start mr-2'>
              <p className='font-semibold  min-w-[90px]'>Yayın Evi</p>
              <p className=''> : {selectedBook?.book?.pages_count}</p>
            </div> */}

          </div>
        </Card>
      )}

      {isExpanded && (
        <Textarea
          label="Kitap hakkında bir şeyler yazın..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-4"
        />
      )}

      {isExpanded && (
        <Button
          color="primary"
          className="disabled:bg-default-500 bg-primary"
          disabled={!selectedBook || !content}
          onClick={handleSubmit}
        >
          Share Post
        </Button>
      )}
    </Card>
  );
};

export default BookPostComponent;
