'use client';
import { createReportClient } from '@/app/[locale]/client/report';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import { TextSelect } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  openReport: boolean;
  setOpenReport: (openReport: boolean) => void;
  connection: string;
  id: string;
};
const enumReportType = [
  { value: 'spam', label: 'Spam' },
  { value: 'hate', label: 'Hate Speech' },
  { value: 'violence', label: 'Violence' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'self-harm', label: 'Self-Harm' },
  { value: 'nudity', label: 'Nudity' },
  { value: 'fake', label: 'Fake News' },
  { value: 'other', label: 'Other' },
];

const ReportModal = ({ openReport, setOpenReport, connection, id }: Props) => {
  //  id userin idsi
  const [content, setContent] = useState<string>('');
  const [selectedKeys, setSelectedKeys] = useState<string>('spam');

  const reportUser = async () => {
    try {
      await createReportClient({
        connection,
        connectionId: id,
        type: selectedKeys,
        content,
        reported: id,
      });
      setOpenReport(false);
      toast.success('Kullanıcı başarıyla bildirildi');
    } catch (error) {}
  };

  return (
    <div>
      <Modal
        isOpen={openReport}
        onClose={() => {
          setOpenReport(false);
        }}
      >
        <ModalContent>
          <ModalHeader>
            Bu kullanıcıyı bildirmek için aşağıdaki formu kullanın
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col items-center gap-2 w-full">
              <Select
                className="w-full"
                label="Report Type"
                defaultSelectedKeys={selectedKeys}
                value={[selectedKeys]}
                size="sm"
                onChange={(e) => {
                  setSelectedKeys(e.target.value);
                }}
              >
                {enumReportType.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>

              <Textarea
                variant="bordered"
                label={'Açıklama'}
                placeholder={'Açıklamanızı girin...'}
                startContent={
                  <TextSelect className="w-4 h-4 text-default-400" />
                }
                value={content}
                onValueChange={(e: string) => {
                  setContent(e);
                }}
              />
              {/* <Button
                onClick={() => changeBookType(book)}
                className="bg-primary text-white disabled:bg-default-500 w-12 h-12 min-w-12 min-h-12 max-w-12 max-h-12 p-1"
                disabled={type === selectedKeys}
              >
                {loadingType ? (
                  <div className="animate-spin">⌛</div>
                ) : (
                  <Save size={16} />
                )}
              </Button> */}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() => {
                setOpenReport(false);
              }}
            >
              Kapat
            </Button>
            <Button color="primary" onClick={reportUser}>
              Bildir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ReportModal;
