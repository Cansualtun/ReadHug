'use client';
import {
  clientCreateBookNotes,
  getClientBookNotes,
} from '@/app/[locale]/client/book';
import { Button } from '@nextui-org/button';
import { Input, Textarea } from '@nextui-org/input';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  openBookNotes: any;
  book: any;
  profileData: any;
};

const BookNotes = ({ openBookNotes, book, profileData }: Props) => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState('');
  const [page, setPage] = useState('');
  const [profile, setProfile] = useState(profileData);
  const { isSelf, isLoggedIn } = profile;

  const getNotes = async (bookId: string) => {
    const { data } = await getClientBookNotes(bookId);
    setNotes(data);
  };
  const createBookNote = async () => {
    if (book.process.pageCount < parseInt(page)) {
      toast.error('Not sayfası kitap sayfasından büyük olamaz');
      return;
    }
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
    setProfile(profileData);
  }, [profileData]);
  useEffect(() => {
    if (openBookNotes?._id) {
      getNotes(openBookNotes?._id);
    }
  }, [openBookNotes]);

  if (openBookNotes?._id === book?._id) {
    return (
      <div className="p-4 bg-default-100 rounded-lg">
        {isSelf && isLoggedIn && (
          <div className="space-y-4">
            <Textarea
              placeholder="Type anythins..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              minRows={3}
              required
              classNames={{
                input: 'text-lg font-hand2',
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
        )}

        <div>
          {notes.length > 0 ? (
            <div className="mt-4">
              <div className="flex flex-col gap-2">
                <h4 className="ml-1 text-lg font-semibold">Notlar</h4>
                {notes
                  .sort((a: any, b: any) => {
                    if (a.notePage === null) return 1;
                    if (b.notePage === null) return -1;
                    return a.notePage - b.notePage;
                  })
                  .map((item: any) => {
                    return (
                      <div
                        className="grid grid-cols-12 gap-2 rounded-lg relative"
                        key={item._id}
                      >
                        {/* {item.notePage ? (
                          <div className="px-3 absolute md:static top-3 right-3 flex items-center bg-primary/20 text-primary rounded-md col-span-12 md:col-span-2 max-h-7">
                            <NotepadText
                              size={16}
                              className="mr-1 min-w-4 min-h-4"
                            />
                            <p className="text-sm">{item.notePage}</p>
                          </div>
                        ) : (
                          <div className="px-3 col-span-2 absolute md:static top-3 right-3 text-sm text-gray-400 border border-primary-80  max-h-7 rounded-md flex justify-center items-center">
                            Sayfasız
                          </div>
                        )} */}
                        <div className="md:col-span-12 col-span-12">
                          <blockquote className="p-4 border-s-4 border-default-300 bg-default-50 rounded-lg">
                            <span className="flex items-center gap-2 mb-2">
                              <svg
                                className="w-4 h-4 text-primary"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 18 14"
                              >
                                <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                              </svg>
                              <span className="text-primary ">
                                {item.notePage ?? 'Sayfasız'}
                              </span>
                            </span>
                            <p
                              className="font-medium text-xl leading-relaxed text-default-900 font-hand2 "
                              style={{ whiteSpace: 'pre-wrap' }}
                            >
                              {item.note}
                            </p>
                          </blockquote>
                        </div>
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
