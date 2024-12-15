import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader
} from '@nextui-org/react';
import React, { useEffect, useRef } from 'react';

type Props = {
  isOpen: boolean;
  handleClick: () => void;
  handleClose: () => void;
  title?: string | React.ReactNode;
  body: string | React.ReactNode;
  confirmText?: string | React.ReactNode;
  deniedText?: string | React.ReactNode;
};

const CustomModal = ({
  isOpen = false,
  handleClick,
  handleClose,
  title,
  body,
  confirmText = 'Onayla',
  deniedText = 'İptal',
}: Props) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    isOpen && (
      <div
        className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-default-500/20 "
        style={{ zIndex: 9999 }}
      >
        <div className="fadeindown" style={{}} ref={modalRef}>
          <Card className="bg-default-100 w-3/4 h-3/4">
            {title && (
              <CardHeader className="border-b border-b-default-200">
                {title}
              </CardHeader>
            )}

            <CardBody className="flex-1 h-full self-stretch text-center text-default-900 flex justify-center items-center">
              {body}
            </CardBody>
            <CardFooter className="border-t border-t-default-200 flex justify-center items-center gap-2">
              <Button size="sm" onClick={handleClose}>
                {deniedText}
              </Button>
              <Button
                size="sm"
                onClick={handleClick}
                className="bg-danger/20 text-danger"
              >
                {confirmText}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  );
};

export default CustomModal;
