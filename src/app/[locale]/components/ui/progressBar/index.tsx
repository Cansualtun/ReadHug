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
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">İlerleme</span>
                {showChip && (
                    <Chip
                        className="text-tiny"
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
            <div className="flex items-center gap-1.5 text-tiny text-success">
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
                    track: "drop-shadow-sm border border-default-200",
                    indicator: "bg-gradient-to-r from-success-500 to-success-400",
                    value: "text-tiny text-foreground font-medium",
                }}
            />

            {labelPosition === 'bottom' && renderProgressLabel()}
            {renderCompletedMessage()}
        </div>
    );
};

export default ProgressBar;
