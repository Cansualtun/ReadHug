'use client';
import { useGetUserBookSearchMutation } from '@/store/BookStore';
import { usePostShareMutation } from '@/store/PostStore';
import { Avatar, Button, Card, Input, Textarea } from '@nextui-org/react';
import { BookOpen, CircleX, ScrollText, User2 } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface BookPostComponentProps {
  userData: any;
  mount?: () => void;
}
interface Book {
  id: string;
  name: string;
  book_img: string;
  authorData: any;
}

const BookPostComponent: React.FC<BookPostComponentProps> = ({
  userData,
  mount,
}) => {
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
    if (mount) {
      await mount();
    }
  };

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
          search,
        },
      };
      const { data } = await getUserBookSearch(payload);
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
    <div className="w-full mx-auto">
      <Card
        shadow="sm"
        ref={containerRef}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {!isExpanded ? (
          <div className="p-2 cursor-pointer">
            <div
              className="flex items-center gap-2"
              onClick={() => setIsExpanded(true)}
            >
              <Avatar
                src={userData?.image ?? '/assets/avatar.png'}
                size="sm"
                className="w-8 h-8"
              />
              <span className="text-default-400 text-sm flex-1">
                Click to share a book...
              </span>
              <BookOpen className="w-4 h-4 text-default-400" />
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar
                src={userData?.image ?? '/assets/avatar.png'}
                size="md"
                className="w-10 h-10"
              />
              <div className="hidden md:block">
                <div className="text-sm font-medium">@{userData?.userName}</div>
                <div className="text-xs text-default-400">
                  {userData?.firstName} {userData?.lastName}
                </div>
              </div>
            </div>
            <Input
              type="text"
              placeholder="Search in your books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<BookOpen className="w-4 h-4 text-default-400" />}
              size="sm"
              className="mb-3"
            />
            {searchTerm && books.length > 0 && (
              <div className="mb-3">
                <Card className="p-1">
                  <div className="max-h-48 overflow-y-auto">
                    {books.map((book: any) => (
                      <div
                        key={book?._id}
                        className="flex items-center gap-3 p-2 hover:bg-default-100 cursor-pointer"
                        onClick={() => handleBookSelect(book)}
                      >
                        <div className="relative w-10 h-14 flex-shrink-0">
                          <Image
                            src={
                              book?.book?.images?.thumbnail ??
                              '/assets/book-placeholder.png'
                            }
                            alt={book?.book?.name}
                            fill
                            className="rounded object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium line-clamp-1">
                            {book?.book?.name}
                          </p>
                          <p className="text-xs text-default-500 line-clamp-1 hidden sm:block">
                            {book?.authorData[0]?.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
            {selectedBook && (
              <div className="mb-3">
                <Card className="p-3 bg-default-50 relative">
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="absolute right-2 top-2 text-default-400 hover:text-danger"
                  >
                    <CircleX size={16} />
                  </button>
                  <div className="flex gap-3">
                    <div className="relative w-12 h-16 flex-shrink-0">
                      <Image
                        src={
                          selectedBook?.book?.images?.thumbnail ??
                          '/assets/book-placeholder.png'
                        }
                        alt={selectedBook?.bookName}
                        fill
                        className="rounded object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium mb-1 line-clamp-2">
                        {selectedBook?.book?.name}
                      </p>
                      <p className="text-xs text-default-500 line-clamp-1 hidden sm:block">
                        {selectedBook?.authorData
                          ?.map((author: any) => author.name)
                          .join(', ')}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            <Textarea
              placeholder="Share your thoughts about this book..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              minRows={3}
              className="mb-3"
            />
            <div className="flex justify-end items-center gap-2">
              <Button
                size="sm"
                variant="light"
                className="text-default-400"
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                size="sm"
                className="px-4"
                disabled={!selectedBook || !content}
                onClick={handleSubmit}
              >
                Share
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BookPostComponent;
