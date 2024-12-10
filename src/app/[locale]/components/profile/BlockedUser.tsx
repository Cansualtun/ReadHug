'use client';
import React from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { UserRoundX } from 'lucide-react';

interface BlockedUserProps {
  blockType: string;
  blockedUsername: string;
}

const BlockedUserMessage: React.FC<BlockedUserProps> = ({
  blockType,
  blockedUsername,
}) => {
  const getBlockMessage = () => {
    switch (blockType) {
      case '1':
        return `Sen ${blockedUsername} kullanıcısını engelledin.`;
      case '2':
        return `${blockedUsername} seni engelledi.`;
      case '3':
        return `${blockedUsername} ile karşılıklı olarak engellendiniz.`;
      default:
        return 'Bu kullanıcı engellenmiş.';
    }
  };

  const getBlockDescription = () => {
    switch (blockType) {
      case '1':
        return 'Bu kullanıcının profilini görüntüleyemezsin.';
      case '2':
        return 'Bu kullanıcı seni engellediği için profilini görüntüleyemiyorsun.';
      case '3':
        return 'Karşılıklı engellemeden dolayı profil görüntülenemiyor.';
      default:
        return 'Profil erişimine izin verilmemiş.';
    }
  };

  return (
    <Card className="w-full mx-auto shadow-danger" shadow="sm">
      <CardHeader className="flex gap-3 bg-default-200 justify-center">
        <UserRoundX size={32} className="text-danger" />
        <p className="font-semibold text-danger">Profil Erişimi Engellendi</p>
      </CardHeader>
      <CardBody className="text-center">
        <h2 className="text-lg font-medium text-default-950 mb-2">
          {getBlockMessage()}
        </h2>
        <p className="text-default-800 mb-4">{getBlockDescription()}</p>
      </CardBody>
    </Card>
  );
};

export default BlockedUserMessage;
