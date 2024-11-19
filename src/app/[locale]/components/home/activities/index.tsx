'use client'
import React from 'react'
import { Card, CardBody, CardHeader, Button, Progress, Badge } from "@nextui-org/react"
import { Book, BookOpen, CheckCircle, Library } from "lucide-react"
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import ProgressBar from '../../ui/progressBar'

export default function ReadingTracker() {
    const t = useTranslations('ReadingTracker');
    const [progress, setProgress] = React.useState(38)

    const shelves = [
        { icon: Book, label: t('library.shelves.toRead'), count: 0 },
        { icon: BookOpen, label: t('library.shelves.reading'), count: 1 },
        { icon: CheckCircle, label: t('library.shelves.completed'), count: 4 },
    ]

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4 p-4 pb-0 sticky top-[55px]">
            <Card className='bg-default-100'>
                <CardHeader className="border-b">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {t('currentlyReading.title')}
                    </h2>
                </CardHeader>
                <CardBody className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative group w-[120px] h-[160px]">
                            <Image
                                src="https://i.dr.com.tr/cache/600x600-0/originals/0001946721001-1.jpg"
                                alt="Palyatif Toplum book cover"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg transition-all duration-200"
                            />
                            <div className="absolute inset-0 bg-default-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                <Button size="sm" variant="flat" color="default">
                                    {t('currentlyReading.viewDetails')}
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg">Palyatif Toplum</h3>
                                <p className="text-default-500">{t('currentlyReading.by')} Byung-Chul Han</p>
                            </div>
                            <div className="space-y-2">
                                <ProgressBar
                                    value={progress}
                                    total={78}
                                    currentValue={30}
                                    showChip
                                    showCompletedMessage
                                    progressColor="warning"
                                    labelPosition="top"
                                    showPage={false}

                                />
                                {progress >= 100 && (
                                    <div className="flex items-center gap-1.5 text-primary text-small">
                                        <CheckCircle size={14} />
                                        <span className="font-medium">{t('currentlyReading.bookCompleted')}</span>
                                    </div>
                                )}
                            </div>
                            <Button

                                className="w-full bg-primary text-white"
                                onPress={() => setProgress((p) => Math.min(100, p + 10))}
                            >
                                {t('currentlyReading.updateProgress')}
                            </Button>
                        </div>
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
        </div>
    )
}