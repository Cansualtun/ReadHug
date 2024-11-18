import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Card,
    Select,
    SelectItem
} from "@nextui-org/react";
import { Search } from "lucide-react";
import { debounce } from 'lodash';
import axios from 'axios';
import Image from 'next/image';

const BookSearchModal = ({ isOpen, onClose }: any) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any>([]);
    const [selectedBooks, setSelectedBooks] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const readingStatusOptions = [
        { label: "Okundu", value: "0" },
        { label: "Okunmakta", value: "1" },
        { label: "Okumak İstenilen", value: "2" }
    ];

    const fetchSearchResults = async (query: any) => {
        if (query.length < 2) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios(`http://localhost:4000/third/google/book/search?name=${query}`);
            setSearchResults(data);
            setShowDropdown(true);
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search function
    const debouncedSearch = useCallback(
        debounce((query) => {
            fetchSearchResults(query);
        }, 500),  // 500ms gecikme
        []
    );

    useEffect(() => {
        // Component unmount olduğunda debounce'u temizle
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
            setSelectedBooks([...selectedBooks, { ...book, type: "0" }]);
        }
        setSearchQuery("");
        setShowDropdown(false);
    };

    const handleStatusChange = (bookName: any, status: any) => {
        const updatedBooks: any = selectedBooks.map((book: any) =>
            book?.name === bookName ? { ...book, type: status } : book
        );
        setSelectedBooks(updatedBooks);
    };

    const removeBook = (bookName: any) => {
        setSelectedBooks(selectedBooks.filter((book: any) => book.name !== bookName));
    };

    const handleSave = async () => {
        // onSave(selectedBooks);
        setLoadingData(true)
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            for (const book of selectedBooks) {
                if (book._id) {
                    const { data } = await axios.post(`http://localhost:4000/book/user/createBookFromList`, {
                        bookId: book._id,
                        type: book.type
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                } else {
                    const { data } = await axios.post(`http://localhost:4000/third/google/book/create`, {
                        ...book
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                }
            }
            setLoadingData(false)
            selectedBooks([])
            onClose()
        } catch (error) {
            setLoadingData(false)
            selectedBooks([])
            console.log("error", error);

        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" className='h-[calc(100vh-200px)]'>
            <ModalContent className='flex flex-col justify-between flex-1'>
                <ModalHeader className='border-b'>Kitap Ara</ModalHeader>
                <ModalBody className=''>
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
                                            src={book.book_img ?? "/assets/book-placeholder.png"}
                                            alt={book.name}
                                            className="h-12 w-8 object-fill border border-primary/20 rounded-md"
                                            width={32}
                                            height={48}
                                        />
                                        <div className=''>
                                            <p className="font-medium text-default-900">{book.name}</p>
                                            <p className="text-sm text-default-700">{book._id ? book?.author?.name || "" : book.author}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedBooks.length > 0 && (
                        <div className="mt-2">
                            <h4 className="font-semibold mb-2">Seçilen Kitaplar</h4>
                            <div className="space-y-2 overflow-y-auto scroll-container max-h-[477px]">
                                {selectedBooks.map((book: any) => (
                                    <Card shadow='none' key={book.slug} className="p-2 border relative" isBlurred >
                                        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
                                            <div className='flex justify-start items-center flex-1 w-full'>
                                                <Image
                                                    src={book.book_img ?? "/assets/book-placeholder.png"}
                                                    alt={book.name}
                                                    className="h-20 w-16 object-fill border border-primary/20 rounded-md"
                                                    width={60}
                                                    height={80}
                                                />
                                                <div className="flex-grow ml-2">
                                                    <h3 className="font-semibold text-default-900">{book.name}</h3>
                                                    <p className="text-sm text-default-700">{book._id ? book.author?.name : book.author}</p>
                                                </div>
                                            </div>
                                            <Select
                                                className="min-w-full md:min-w-40 md:max-w-40"
                                                selectedKeys={[book.type]}
                                                onChange={(e) => handleStatusChange(book.name, e.target.value)}
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
                                                className='absolute md:static top-1 right-1 bg-default-100/50'
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
                <ModalFooter className='border-t'>
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