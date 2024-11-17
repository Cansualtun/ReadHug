"use client"
import React, { useEffect, useState, useRef } from "react";
import { Input, Textarea, Button, Card } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";

interface Book {
    id: string;
    name: string;
    book_img: string;
    authorData: any
}

const PostShare: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [content, setContent] = useState("");
    const [isExpanded, setIsExpanded] = useState(true);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [books, setBooks] = useState<any>([]);

    const containerRef = useRef<HTMLDivElement>(null);



    const handleBookSelect = (book: Book) => {
        setSelectedBook(book);
        setSearchTerm("");
    };

    const handleSubmit = () => {
        if (!selectedBook || !content) {
            alert("Please select a book and enter content!");
            return;
        }

        console.log({
            book: selectedBook,
            content,
        });
        alert("Post shared successfully!");
        setSelectedBook(null);
        setContent("");
        setIsExpanded(false);
    };

    // Scroll durumunu dinle
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

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Komponent dışına tıklama ile kapanma
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

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isExpanded, hasScrolled]);

    const getAllBook = async (search: string) => {
        if (!search) {
            return
        }
        try {
            const { data } = await axios(`http://localhost:4000/book/allBooks?limit=10&search=${search}`)
            setBooks(data.data)
        } catch (error) {

        }
    }

    useEffect(() => {
        if (searchTerm) {
            getAllBook(searchTerm)
        }
    }, [searchTerm]);


    return (
        <Card shadow="sm"

            ref={containerRef}
            className={`relative w-full p-2 mb-10 transition-all ${isExpanded ? "h-auto" : "h-[56px] overflow-hidden"
                }`}
        >
            {/* Search Bar */}
            <Input
                type="text"

                placeholder="Type to search..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value)
                }}
                onFocus={() => setIsExpanded(true)} // Arama çubuğuna tıklanınca genişlet
                className="mb-4"
            />

            {/* Dropdown for Book Selection */}
            {isExpanded && searchTerm && (
                <div className="bg-white border rounded-lg shadow-md max-h-40 overflow-y-auto mb-4 transition-all absolute top-[52px] z-50 w-full max-w-xl divide-y-1">
                    {books.map((book: any) => (
                        <div
                            key={book?._id}
                            className="p-2 hover:bg-gray-100  cursor-pointer flex"
                            onClick={() => handleBookSelect(book)}
                        >
                            <div>
                                <Image className="rounded-lg border-2 shadow-sm" src={book?.book_img ?? "/assets/avatar.png"} alt={book?.name} width={32} height={64} />
                            </div>
                            <div className="ml-4">
                                <p>{book?.name}</p>
                                <p>{book?.authorData?.name}</p>

                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Selected Book */}
            {isExpanded && selectedBook && (
                <div className="mb-2 pl-4 flex">
                    <div>
                        <Image className="rounded-lg border-2 shadow-sm" src={selectedBook?.book_img ?? "/assets/avatar.png"} alt={selectedBook?.name} width={32} height={64} />
                    </div>
                    <div className="ml-4">
                        <p>{selectedBook?.name}</p>
                        <p>{selectedBook?.authorData?.name}</p>

                    </div>
                </div>
            )}

            {/* Content Area */}
            {isExpanded && (
                <Textarea
                    label="Content"
                    placeholder="Write something about the book..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mb-4"
                />
            )}

            {/* Share Button */}
            {isExpanded && (
                <Button color="primary" onClick={handleSubmit}>
                    Share Post
                </Button>
            )}
        </Card>
    );
};

export default PostShare;
