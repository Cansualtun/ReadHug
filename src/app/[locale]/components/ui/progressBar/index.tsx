import React, { useState } from 'react';
import { Progress, Chip, Slider } from '@nextui-org/react';
import { CheckCircle, Loader, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProgressBarProps {
  value: number;
  total: number;
  currentValue: number;
  showChip?: boolean;
  showCompletedMessage?: boolean;
  className?: string;
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
  showChip = true,
  showCompletedMessage = true,
  className = '',
  chipColor = 'success',
  progressColor = 'success',
  labelPosition = 'top',
  size = 'sm',
  showPage = false,
  bookId,
}) => {
  const t = useTranslations('ReadingTracker');
  const [progressValue, setProgressValue] = useState<number>(currentValue);
  const percent = Math.round(value);
  const isCompleted = percent >= 100;
  const [openProgress, setOpenProgress] = useState(false);
  const [loading, setLoading] = useState(false);

  const renderProgressLabel = () => (
    <div className="flex items-center justify-between">
      <div className="flex flex-row items-center justify-between w-full bg-default-200 rounded-full">
        <span className="text-sm font-medium flex justify-center items-center flex-1">
          İlerleme
        </span>
        {showChip && (
          <Chip
            className="text-tiny bg-primary text-white dark:text-white"
            color={chipColor}
            variant="flat"
            radius="full"
          >
            {percent}%
          </Chip>
        )}
      </div>
      {showPage ?? (
        <span className="text-tiny text-default-400">
          {currentValue}/{total} sayfa
        </span>
      )}
    </div>
  );

  const renderCompletedMessage = () =>
    isCompleted &&
    showCompletedMessage && (
      <div className="flex items-center gap-1.5 text-tiny text-primary">
        <CheckCircle size={14} />
        <span className="font-medium">Kitap tamamlandı!</span>
      </div>
    );

  const updateBookRead = async (userBookId: string) => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      setLoading(true);
      await fetch(`${BASE_URL}/book/user/updateBookFromList`, {
        method: 'PATCH',
        body: JSON.stringify({
          userBookId,
          type: '1',
          readCount: progressValue,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setOpenProgress(false);
      setLoading(false);
    } catch (error) {
      setOpenProgress(false);
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-3  ${className}`}>
      {/* {labelPosition === 'top' && renderProgressLabel()} */}
      {progressValue >= total && labelPosition == 'top' && (
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
          value={progressValue || 0}
          maxValue={total || 0}
          onChange={(page: any) => {
            setProgressValue(parseInt(page));
            setOpenProgress(true);
          }}
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
      {/* <Progress
                aria-label="Reading progress"
                value={percent}
                color={progressColor}
                showValueLabel={false}
                size={size}
                className="max-w-full"
                classNames={{
                    base: "max-w-full",
                    track: "drop-shadow-sm",
                    indicator: "bg-gradient-to-r from-primary to-orange-400",
                    value: "text-tiny text-foreground font-medium ",
                }}
            /> */}

      {progressValue >= total && labelPosition == 'bottom' && (
        <div className="flex justify-end items-center flex-1 w-full gap-1.5 text-primary text-small">
          <CheckCircle size={14} />
          <span className="font-medium">
            {t('currentlyReading.bookCompleted')}
          </span>
        </div>
      )}
      {/* {labelPosition === 'bottom' && renderProgressLabel()} */}
      {/* {renderCompletedMessage()} */}
    </div>
  );
};

export default ProgressBar;
