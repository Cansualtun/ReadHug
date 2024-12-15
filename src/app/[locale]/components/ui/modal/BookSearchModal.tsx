import {
  Button,
  Card,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Slider,
} from '@nextui-org/react';
import axios from 'axios';
import { debounce } from 'lodash';
import { BookmarkPlus, Search, ShieldQuestion } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Loading from '../loading';

let BASE_URL = '';
if (process.env.NODE_ENV === 'development') {
  BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
}
if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://bookarchive-production.up.railway.app';
}

const BookSearchModal = ({ isOpen, onClose, mount }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>([]);
  const [selectedBooks, setSelectedBooks] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const readingStatusOptions = [
    { label: 'Okundu', value: '0' },
    { label: 'Okunmakta', value: '1' },
    { label: 'Okumak İstenilen', value: '2' },
  ];
  const fetchSearchResults = async (query: any) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      const { data } = await axios(
        `${BASE_URL}/third/google/book/search?name=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setSearchResults(data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  // Debounce search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      fetchSearchResults(query);
    }, 500), // 500ms gecikme
    [],
  );
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleSearch = (value: any) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };
  const handleBookSelect = (book: any) => {
    if (!selectedBooks.some((b: any) => b?.name === book?.name)) {
      setSelectedBooks([...selectedBooks, { ...book, type: '0' }]);
    }
    setSearchQuery('');
    setShowDropdown(false);
  };
  const handleStatusChange = (bookName: any, status: any) => {
    const updatedBooks: any = selectedBooks.map((book: any) =>
      book?.name === bookName ? { ...book, type: status } : book,
    );
    setSelectedBooks(updatedBooks);
  };
  const handleReadCountChange = (bookName: any, readCount: any) => {
    const updatedBooks: any = selectedBooks.map((book: any) =>
      book?.name === bookName ? { ...book, readCount } : book,
    );
    setSelectedBooks(updatedBooks);
  };
  const removeBook = (bookName: any) => {
    setSelectedBooks(
      selectedBooks.filter((book: any) => book.name !== bookName),
    );
  };
  const handleSave = async () => {
    // onSave(selectedBooks);
    setLoadingData(true);
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
      for (const book of selectedBooks) {
        if (book._id) {
          const { data } = await axios.post(
            `${BASE_URL}/book/user/createBookFromList`,
            {
              bookId: book._id,
              type: book.type,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          );
        } else {
          const { data } = await axios.post(
            `${BASE_URL}/third/google/book/create`,
            {
              ...book,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          );
        }
      }
      setLoadingData(false);
      setSelectedBooks([]);
      onClose();
      await mount();
    } catch (error: any) {
      setLoadingData(false);
      toast.error(error?.response?.data?.message);
      console.log('error', error);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      className="h-[calc(100vh-200px)] "
    >
      <ModalContent className="flex flex-col justify-between flex-1 relative">
        {loadingData && (
          <div
            className="absolute w-full h-full bg-default-900/20 flex justify-center items-center text-primary text-4xl"
            style={{ zIndex: 999999999 }}
          >
            <Loading />
          </div>
        )}
        <ModalHeader className="border-b flex justify-between">
          <h3> Kitap Ara</h3>
          <div className="flex items-center pr-10">
            <Link
              href={'/tr/bookRequest'}
              color="primary"
              className="p-0 rounded-lg min-w-6 min-h-6 mr-2 flex justify-center items-center bg-primary"
            >
              <BookmarkPlus size={16} className="text-white" />
            </Link>
            <p className="text-sm">Kitap Ekleme Talebi Oluştur.</p>
            <div className="ml-2">
              <Popover
                showArrow
                backdrop="opaque"
                placement="right"
                classNames={{
                  base: [
                    // arrow color
                    'before:bg-default-200',
                  ],
                  content: [
                    'py-3 px-4 border border-default-200',
                    'bg-gradient-to-br from-white to-default-300',
                    'dark:from-default-100 dark:to-default-50',
                  ],
                }}
              >
                <PopoverTrigger>
                  <ShieldQuestion
                    size={16}
                    className="text-primary hover:text-primary/50 cursor-help"
                  />
                </PopoverTrigger>
                <PopoverContent>
                  {(titleProps) => (
                    <div className="px-1 py-2">
                      <h3 className="text-small font-bold" {...titleProps}>
                        Kitap Ekleme Talebi Nedir ?
                      </h3>
                      <div className="text-tiny">
                        Arama çubuğunda aradığınız kitabı bulamıyorsanız, kitap
                        ekleme talebi oluşturabilirsiniz.
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="">
          <div className="relative" ref={dropdownRef}>
            <Input
              placeholder="Kitap adı veya yazar..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              endContent={
                loading ? (
                  <div className="animate-spin">⌛</div>
                ) : (
                  <Search className="h-4 w-4 text-gray-400" />
                )
              }
            />

            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-default-50 rounded-lg shadow-lg border border-default-200 max-h-64 overflow-y-auto scroll-container">
                {searchResults.map((book: any) => (
                  <div
                    key={book.slug}
                    className="p-2 hover:bg-default-100 cursor-pointer flex items-center gap-2"
                    onClick={() => handleBookSelect(book)}
                  >
                    <Image
                      src={
                        book?.images?.thumbnail ??
                        '/assets/book-placeholder.png'
                      }
                      alt={book.name}
                      className="h-12 w-8 object-fill border border-primary/20 rounded-md"
                      width={32}
                      height={48}
                    />
                    <div className="">
                      <p className="font-medium text-default-900">
                        {book.name}
                      </p>
                      <p className="text-sm text-default-700">
                        {book._id
                          ? book.authors.map((i: any) => i.name).join(' & ') ||
                            ''
                          : book.authors.join(' & ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedBooks.length > 0 && (
            <div className="mt-2">
              <h4 className="font-semibold mb-2">Seçilen Kitaplar</h4>
              <div className="space-y-2 overflow-y-auto scroll-container max-h-[402px] md:max-h-[477px]">
                {selectedBooks.map((book: any) => (
                  <Card
                    shadow="none"
                    key={book.slug}
                    className="p-2 border relative"
                    isBlurred
                  >
                    <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
                      <div className="flex flex-col flex-1 w-full">
                        <div className="flex justify-start items-center flex-1 w-full">
                          <div className="self-stretch flex items-start md:items-center h-20 w-16">
                            <Image
                              src={
                                book?.images?.thumbnail ??
                                '/assets/book-placeholder.png'
                              }
                              alt={book.name}
                              className="h-20 min-w-16 object-fill border border-primary/20 rounded-md"
                              width={60}
                              height={80}
                            />
                          </div>
                          <div className="flex-grow ml-2">
                            <h3 className="font-semibold text-default-900 text-small md:text-large">
                              {book.name}
                            </h3>
                            <p className="text-sm text-default-700">
                              {book._id
                                ? book.authors
                                    .map((i: any) => i.name)
                                    .join(' & ') || ' '
                                : book.authors.join(' & ')}
                            </p>
                          </div>
                        </div>

                        {book.type === '1' && book.pageCount ? (
                          <div className="w-full h-10">
                            <Slider
                              label="Sayfa Sayısı: "
                              size="sm"
                              maxValue={book.pageCount}
                              onChange={(e: any) => {
                                handleReadCountChange(book.name, e[0]);
                              }}
                              getValue={(page) =>
                                ` ${page} of ${book.pageCount} Page`
                              }
                              className="max-w-md"
                            />
                          </div>
                        ) : book.type === '2' && book.pageCount ? (
                          <div className="w-full h-10">
                            <Slider
                              label="Sayfa Sayısı: "
                              size="sm"
                              maxValue={book.pageCount}
                              isDisabled
                              getValue={(page) =>
                                ` 0 of ${book.pageCount} Page`
                              }
                              className="max-w-md"
                            />
                          </div>
                        ) : (
                          book.type === '0' &&
                          book.pageCount && (
                            <div>
                              <Slider
                                label="Sayfa Sayısı: "
                                size="sm"
                                maxValue={book.pageCount}
                                isDisabled
                                value={book.pageCount}
                                getValue={(page) =>
                                  ` ${book.pageCount} of ${book.pageCount} Page`
                                }
                                className="max-w-md"
                              />
                            </div>
                          )
                        )}
                        {!book.pageCount && (
                          <Chip color="primary" className="mt-2">
                            Sayfa sayısı bilinmiyor.
                          </Chip>
                        )}
                      </div>

                      <Select
                        className="min-w-full md:min-w-40 md:max-w-40"
                        selectedKeys={[book.type]}
                        onChange={(e) =>
                          handleStatusChange(book.name, e.target.value)
                        }
                      >
                        {readingStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        className="absolute md:static top-1 right-1 bg-default-100/50"
                        onPress={() => removeBook(book.name)}
                      >
                        ✕
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="border-t">
          <Button color="danger" variant="light" onPress={onClose}>
            İptal
          </Button>
          <Button color="primary" onPress={handleSave}>
            Kaydet
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BookSearchModal;
