import React from 'react';
import { Progress, Chip } from "@nextui-org/react";
import { CheckCircle } from "lucide-react";

interface ProgressBarProps {
    value: number;
    total: number;
    currentValue: number;
    showChip?: boolean;
    showCompletedMessage?: boolean;
    className?: string;
    chipColor?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
    progressColor?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
    labelPosition?: 'top' | 'bottom';
    size?: "sm" | "md" | "lg";
    showPage?: boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    total,
    currentValue,
    showChip = true,
    showCompletedMessage = true,
    className = "",
    chipColor = "success",
    progressColor = "success",
    labelPosition = "top",
    size = "sm",
    showPage = false
}) => {
    const percent = Math.round(value);
    const isCompleted = percent >= 100;

    const renderProgressLabel = () => (
        <div className="flex items-center justify-between">
            <div className="flex flex-row items-center justify-between w-full bg-default-200 rounded-full">
                <span className="text-sm font-medium flex justify-center items-center flex-1">İlerleme</span>
                {showChip && (
                    <Chip
                        className="text-tiny bg-orange-500 text-white dark:text-white"
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

    const renderCompletedMessage = () => (
        isCompleted && showCompletedMessage && (
            <div className="flex items-center gap-1.5 text-tiny text-orange-500">
                <CheckCircle size={14} />
                <span className="font-medium">Kitap tamamlandı!</span>
            </div>
        )
    );

    return (
        <div className={`space-y-3 ${className}`}>
            {labelPosition === 'top' && renderProgressLabel()}

            <Progress
                aria-label="Reading progress"
                value={percent}
                color={progressColor}
                showValueLabel={false}
                size={size}
                className="max-w-full"
                classNames={{
                    base: "max-w-full",
                    track: "drop-shadow-sm",
                    indicator: "bg-gradient-to-r from-orange-500 to-orange-400",
                    value: "text-tiny text-foreground font-medium ",
                }}
            />

            {labelPosition === 'bottom' && renderProgressLabel()}
            {/* {renderCompletedMessage()} */}
        </div>
    );
};

export default ProgressBar;
