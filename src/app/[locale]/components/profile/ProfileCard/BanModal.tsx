'use client';
import formatBaseUrl from '@/utils/formatBaseUrl';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  userName: string;
  isBlocked: any;
};

const BanModal = ({ open, setOpen, userName, isBlocked }: Props) => {
  const router = useRouter();
  const { token, BASE_URL } = formatBaseUrl();
  const blockerService = async () => {
    try {
      await axios.get(`${BASE_URL}/user/blocker/${userName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success(
        isBlocked === '0' || isBlocked === '2'
          ? 'Kullanıcı başarıyla engellendi'
          : 'Kullanıcının engeli başarıyla kaldırıldı',
      );
      router.refresh();
      setOpen(false);
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div>
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <ModalContent>
          <ModalHeader>
            {isBlocked === '0' || isBlocked === '2'
              ? 'Bu kullanıcıyı engellemek istediğinize emin misiniz?'
              : 'Bu kullanıcının engelini kaldırmak istediğinize emin misiniz?'}
          </ModalHeader>

          <ModalFooter>
            <Button
              onPress={() => {
                setOpen(false);
              }}
            >
              Kapat
            </Button>
            <Button color="primary" onClick={blockerService}>
              {isBlocked === '0' || isBlocked === '2'
                ? 'Engelle'
                : 'Engeli Kaldır'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BanModal;
