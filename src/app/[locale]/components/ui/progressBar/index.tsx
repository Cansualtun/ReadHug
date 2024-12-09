import React, { useState } from 'react';
import { Slider } from '@nextui-org/react';
import { CheckCircle, Loader, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Confetti from 'react-confetti';

interface ProgressBarProps {
  value: number;
  total: number;
  currentValue: number;
  showChip?: boolean;
  showCompletedMessage?: boolean;
  className?: string;
  isSelf?: boolean;
  chipColor?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  progressColor?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  labelPosition?: 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
  showPage?: boolean;
  bookId: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  total,
  currentValue,
  className = '',
  labelPosition = 'top',
  bookId,
  isSelf = true,
}) => {
  const t = useTranslations('ReadingTracker');
  const [progressValue, setProgressValue] = useState<number>(currentValue);
  const [openProgress, setOpenProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const updateBookRead = async (userBookId: string) => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
      let BASE_URL = '';
      if (process.env.NODE_ENV === 'development') {
        BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      }
      if (process.env.NODE_ENV === 'production') {
        BASE_URL = 'https://bookarchive-production.up.railway.app';
      }

      setLoading(true);
      await fetch(`${BASE_URL}/book/user/updateBookFromList`, {
        method: 'PATCH',
        body: JSON.stringify({
          userBookId,
          type: progressValue === total ? '0' : '1',
          readCount: progressValue,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (progressValue === total) {
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 6000);
      }
      setOpenProgress(false);
      setLoading(false);
    } catch (error) {
      setOpenProgress(false);
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-3 relative ${className}`}>
      {showConfetti && (
        <div className="fixed top-0 left-0" style={{ zIndex: 99999999999 }}>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
        </div>
      )}

      {progressValue >= total && labelPosition === 'top' && (
        <div className="absolute -top-4 right-0 flex justify-end items-center flex-1 w-full gap-1.5 text-primary text-small">
          <CheckCircle size={14} />
          <span className="font-medium">
            {t('currentlyReading.bookCompleted')}
          </span>
        </div>
      )}

      <div className="flex items-center">
        <Slider
          label=" "
          size="sm"
          name={`book-update-${bookId}`}
          value={progressValue || 0}
          maxValue={total || 0}
          onChange={(page: any) => {
            if (isSelf) {
              setProgressValue(parseInt(page));
              setOpenProgress(true);
            }
          }}
          isDisabled={!isSelf}
          radius={!isSelf ? 'none' : 'full'}
          getValue={(page) => `${page} / ${total}`}
          className="w-full"
        />
        {progressValue !== currentValue && openProgress ? (
          <button
            onClick={() => updateBookRead(bookId)}
            className="bg-primary p-1 rounded-md ml-2 disabled:bg-primary/50"
            disabled={loading}
          >
            {loading ? (
              <Loader size={16} className="text-white" />
            ) : (
              <Save size={16} className="text-white" />
            )}
          </button>
        ) : (
          <div className="min-w-6 ml-2 min-h-6 bg-transparent"></div>
        )}
      </div>

      {progressValue >= total && labelPosition === 'bottom' && (
        <div className="flex justify-end items-center flex-1 w-full gap-1.5 text-primary text-small">
          <CheckCircle size={14} />
          <span className="font-medium">
            {t('currentlyReading.bookCompleted')}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
