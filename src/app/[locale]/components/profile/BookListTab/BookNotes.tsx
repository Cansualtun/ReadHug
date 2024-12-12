import {
  clientCreateBookNotes,
  getClientBookNotes,
} from '@/app/[locale]/client/book';
import { Button } from '@nextui-org/button';
import { Input, Textarea } from '@nextui-org/input';
import { NotepadText } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {
  openBookNotes: any;
  book: any;
};

const BookNotes = ({ openBookNotes, book }: Props) => {
  //   console.log('book', book);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState('');
  const [page, setPage] = useState('');
  const getNotes = async (bookId: string) => {
    const { data } = await getClientBookNotes(bookId);
    console.log('getNotes', data);
    setNotes(data);
  };
  const createBookNote = async () => {
    let payload: any = {
      note,
      userBookId: book._id,
    };
    if (page) {
      payload.notePage = parseInt(page);
    }
    const data = await clientCreateBookNotes(payload);
    await getNotes(book._id);
    setNote('');
    setPage('');
  };

  useEffect(() => {
    if (openBookNotes?._id) {
      getNotes(openBookNotes?._id);
    }
  }, [openBookNotes]);

  if (openBookNotes?._id === book?._id) {
    return (
      <div className="p-4 bg-default-100 rounded-lg">
        <div className="space-y-4">
          <Textarea
            placeholder="Type anythins..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            minRows={3}
            required
            classNames={{
              input: 'text-sm',
              inputWrapper:
                'bg-default-50 focus:border-default-50 focus:border',
            }}
          />

          <div className="flex justify-between items-center">
            {book?.process?.pageCount > 0 && (
              <div className="max-w-[150px] min-w-[150px]">
                <Input
                  type="number"
                  min={0}
                  size="sm"
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  max={book?.process?.pageCount}
                  label="Sayfa Sayısı"
                  classNames={{
                    input: 'text-sm',
                    inputWrapper:
                      'bg-default-50 focus:border-default-50 focus:border',
                  }}
                />
              </div>
            )}

            <Button
              color="primary"
              className="px-8 text-sm font-medium disabled:bg-default-500"
              disabled={!note}
              onClick={createBookNote}
            >
              Not Oluştur
            </Button>
          </div>
        </div>
        <div>
          {notes.length > 0 ? (
            <div className="mt-4">
              <div className="flex flex-col gap-2">
                {notes
                  .sort((a: any, b: any) => {
                    if (a.notePage === null) return 1;
                    if (b.notePage === null) return -1;
                    return a.notePage - b.notePage;
                  })
                  .map((item: any) => {
                    return (
                      <div
                        className="p-2 bg-default-50 grid grid-cols-12 rounded-lg"
                        key={item._id}
                      >
                        {item.notePage ? (
                          <div className="px-3 flex items-center bg-default-200 text-default-900 mr-2 min-w-fit rounded-md col-span-2 max-h-9">
                            <NotepadText size={18} className="mr-1" />
                            <p className='flex-1 text-end'>{item.notePage}</p>
                          </div>
                        ) : (
                          <div className="col-span-2"></div>
                        )}
                        <div className="col-span-10">{item.note}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <hr />
              <div className="p-4 flex justify-center items-center">
                Bu kitaba eklenmiş not bulunmamaktadır.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return '';
  }
};

export default BookNotes;
