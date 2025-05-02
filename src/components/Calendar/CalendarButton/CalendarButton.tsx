import React, { useEffect, useState } from 'react';
import styles from './CalendarButton.module.scss';
import clsx from 'clsx';
import { SelectionStatus } from "../utils/getSelectionStatus";

type CalendarButtonProps = {
  isDisabled?: boolean;
  appearance?: 'box' | 'rounded';
  isFirstColumn?: boolean;
  isLastColumn?: boolean;
  selectionStatus: SelectionStatus;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
};

const CalendarButton = ({
  isDisabled = false,
  appearance = 'box',
  isFirstColumn = false,
  isLastColumn = false,
  selectionStatus,
  onClick,
  children
}: CalendarButtonProps) => {
  const [className, setClassName] = useState('');

  useEffect(() => {
    const classes = clsx(styles.CalendarButton, {
      [styles['is-disabled']]: isDisabled,
      [styles[`${appearance}-appearance`]]: appearance,
      [styles['is-selected']]: selectionStatus.isSelected,
      [styles['is-highlighted']]: selectionStatus.isSelectedSecondary,
      [styles['is-highlightedMiddle']]: selectionStatus.isMiddleInterval,
      [styles['is-highlightedRangeStart']]: selectionStatus.isStartInterval,
      [styles['is-highlightedRangeEnd']]: selectionStatus.isEndInterval,
      [styles['is-firstColumn']]: isFirstColumn,
      [styles['is-lastColumn']]: isLastColumn,
    });

    setClassName(classes);
  }, [isDisabled, appearance, selectionStatus]);

  const handleClick = (event) => {
    event.stopPropagation();
    if (!isDisabled && onClick) {
      onClick(event);
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
};

export default CalendarButton;
