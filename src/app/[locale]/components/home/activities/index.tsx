'use client'
import React from 'react'
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react"
import { Book, BookOpen, BookPlus, CheckCircle, Library } from "lucide-react"
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import ProgressBar from '../../ui/progressBar'
import { BookType } from 'enums/bookType'
import { Books } from '@/types/book'
import { useSelector } from 'react-redux'
import { selectUser } from '@/store/UserStore/slice'
import NonLoginSidebar from './NonLoginSidebar'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface BookProps {
    books: Books[];
}

export default function ReadingTracker({ books }: BookProps) {
    const t = useTranslations('ReadingTracker');
    const me = useSelector(selectUser)
    const params = useParams()
    const currentBook = books
        .filter(book => book.type === BookType.Reading.toString())
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    const [progress, setProgress] = React.useState(
        currentBook ? parseInt(currentBook.process.percent) : 0
    );
    const shelves = [
        {
            icon: BookPlus,
            label: t('library.shelves.toRead'),
            count: books.filter(book => book.type === BookType.WishList.toString()).length
        },
        {
            icon: BookOpen,
            label: t('library.shelves.reading'),
            count: books.filter(book => book.type === BookType.Reading.toString()).length
        },
        {
            icon: Book,
            label: t('library.shelves.completed'),
            count: books.filter(book => book.type === BookType.Read.toString()).length
        },
    ];

    if (!currentBook && me) {
        return (
            <div className="w-full max-w-2xl mx-auto space-y-4 p-4 pb-0 sticky top-[55px]">
                <Card className='bg-default-100'>
                    <CardBody className="p-6">
                        <p className="text-center text-default-500">
                            {t('currentlyReading.noBook')}
                        </p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        me ? <div className="w-full max-w-2xl mx-auto space-y-4 p-4 pb-0 sticky top-[55px]">
            <Card className='bg-default-100'>
                <CardHeader className="border-b">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {t("currentlyReading.title")}
                    </h2>
                </CardHeader>
                <CardBody className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative group w-[120px] h-[160px]">
                            <Image
                                src={currentBook.bookId.images.thumbnail}
                                alt={`${currentBook.bookId.name} book cover`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg transition-all duration-200"
                            />
                            <div className="absolute px-2 inset-0 bg-default-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                <Link href={`/${params.locale}/personalBooks/${currentBook.bookId.slug}`} className='text-sm bg-white/80 text-center rounded-lg '>
                                    {t('currentlyReading.viewDetails')}
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg">{currentBook.bookId.name}</h3>
                                <p className="text-default-500">
                                    {t('currentlyReading.by')} {currentBook.bookId.authors.map((author: any) => author.name).join(', ')}
                                </p>
                            </div>

                        </div>


                    </div>
                    <div className="space-y-2">
                        <ProgressBar
                            value={progress}
                            total={currentBook.process.pageCount}
                            currentValue={currentBook.process.readCount}
                            showChip
                            showCompletedMessage
                            progressColor="warning"
                            labelPosition="bottom"
                            showPage={false}
                            bookId={currentBook._id as string}
                        />

                    </div>

                </CardBody>
            </Card>

            <Card className='bg-default-100'>
                <CardHeader className="border-b">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Library className="h-5 w-5" />
                        {t('library.title')}
                    </h2>
                </CardHeader>
                <CardBody className="p-4">
                    <div className="space-y-2">
                        {shelves.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-default-100 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <item.icon className="h-4 w-4 text-default-500" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </div>
                                <div>
                                    {item.count}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </div> : <div className="w-full max-w-2xl mx-auto space-y-4 p-4 pb-0 sticky top-[55px]">
            <NonLoginSidebar />
        </div>)

}