"use client"
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@nextui-org/react";
import { useTranslations } from 'next-intl';

const FollowersModal = ({ type }: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const t = useTranslations('ProfileCard');

    return (
        <>
            <div
                className="text-center group cursor-pointer hover:scale-105 transition-transform"
                onClick={onOpen}
            >
                <div className="flex items-center space-x-1">
                    <span className="font-semibold">{type === 'followers'}</span>
                </div>
                <p className="text-xs text-default-500">
                    {type === 'followers' ? t('stats.followers') : t('stats.following')}
                </p>
            </div>

            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <ModalContent>
                    <ModalHeader>
                        {type === 'followers' ? t('modal.followers') : t('modal.following')}
                    </ModalHeader>
                    <ModalBody>
                        <div className="p-4">
                            Modal Content
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default FollowersModal;