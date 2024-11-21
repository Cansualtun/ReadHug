'use client';
import { useGetUserBookSearchMutation } from '@/store/BookStore';
import { usePostShareMutation } from '@/store/PostStore';
import { Avatar, Button, Card, Input, Textarea } from '@nextui-org/react';
import axios from 'axios';
import { BookOpen, CircleX, User2 } from 'lucide-react';
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
  console.log("books", books);

  return (
    <Card
      shadow="sm"
      ref={containerRef}
      className={`w-full transition-all duration-300 ${isExpanded
        ? 'p-4'
        : 'p-2 transform hover:scale-[1.01] cursor-pointer'
        }`}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      <div className={`flex flex-col gap-4 ${!isExpanded && 'opacity-90 hover:opacity-100'}`}>
        {/* Header Section */}
        <div className={`flex items-center justify-between transition-all duration-300 ${!isExpanded ? 'transform scale-95' : ''
          }`}>
          <div className={`flex-1 max-w-md transition-all duration-300 ${!isExpanded ? 'max-w-[200px]' : ''
            }`}>
            <Input
              type="text"
              placeholder={isExpanded ? "Search in your books..." : "Click to share a book..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              startContent={
                <BookOpen
                  className={`transition-all duration-300 ${isExpanded ? 'text-default-400 w-4 h-4' : 'text-primary w-5 h-5'
                    }`}
                />
              }
              classNames={{
                input: `text-sm transition-all duration-300 ${!isExpanded ? 'pl-2' : ''}`,
                inputWrapper: `transition-all duration-300 ${!isExpanded
                  ? 'h-8 min-h-8 py-0 bg-transparent hover:bg-default-100'
                  : 'h-10'
                  }`
              }}
              isReadOnly={!isExpanded}
            />
          </div>
          <div className={`flex items-center gap-3 ml-4 transition-all duration-300 ${!isExpanded ? 'scale-90' : ''
            }`}>
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold">@{userData?.userName}</span>
              <span className={`text-xs text-default-500 transition-all duration-300 ${!isExpanded ? 'hidden' : 'block'
                }`}>
                {userData?.firstName} {userData?.lastName}
              </span>
            </div>
            <Avatar
              src={userData?.image ?? '/assets/avatar.png'}
              size={isExpanded ? "md" : "sm"}
              className={`transition-all duration-300 ${isExpanded
                ? 'border-2 border-primary/20'
                : 'border border-primary/10'
                }`}
            />
          </div>
        </div>

        {/* Search Results - Only show when expanded */}
        {isExpanded && searchTerm && books.length > 0 && (
          <div className="absolute top-16 left-0 w-full max-w-md z-50">
            <Card className="w-full p-1 shadow-lg">
              <div className="max-h-48 overflow-y-auto divide-y divide-default-200">
                {books.map((book: any) => (
                  <div
                    key={book?._id}
                    className="flex items-center gap-3 p-2 hover:bg-default-100 cursor-pointer transition-colors"
                    onClick={() => handleBookSelect(book)}
                  >
                    <div className="relative w-10 h-14 flex-shrink-0">
                      <Image
                        src={book?.book?.images?.thumbnail ?? '/assets/book-placeholder.png'}
                        alt={book?.book?.name}
                        fill
                        className="rounded-sm object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{book?.book?.name}</p>
                      <p className="text-xs text-default-500 truncate">{book?.authorData[0]?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Selected Book Card - Only show when expanded */}
        {isExpanded && selectedBook && (
          <Card className="p-3 bg-default-50">
            <div className="flex gap-4 relative">
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute right-2 top-2 text-default-400 hover:text-danger transition-colors"
              >
                <CircleX size={20} />
              </button>

              <div className="relative w-20 h-28 flex-shrink-0">
                <Image
                  src={selectedBook?.book?.book_img ?? '/assets/book-placeholder.png'}
                  alt={selectedBook?.bookName}
                  fill
                  className="rounded-md shadow-sm object-cover"
                />
              </div>

              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {selectedBook?.book?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User2 size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-default-600 truncate">
                    {selectedBook?.author?.name}
                  </span>
                </div>
                {selectedBook?.book?.pages_count && (
                  <span className="text-xs text-default-500">
                    {selectedBook.book.pages_count} pages
                  </span>
                )}
              </div>
            </div>
          </Card>
        )}
        {isExpanded && (
          <div className="space-y-4">
            <Textarea
              placeholder="Share your thoughts about this book..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              minRows={3}
              classNames={{
                input: "text-sm"
              }}
            />

            <div className="flex justify-end">
              <Button
                color="primary"
                className="px-8 text-sm font-medium"
                disabled={!selectedBook || !content}
                onClick={handleSubmit}
                size="sm"
              >
                Share
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BookPostComponent;
