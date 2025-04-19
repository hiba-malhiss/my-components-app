import React, { useEffect, useState } from 'react';
import styles from './CalendarButton.module.scss';
import clsx from 'clsx';

const CalendarButton = ({
  isDisabled = false,
  isSelected = false,
  isRounded = false,
  isHighlighted = false,
  onClick,
  children
}) => {
  const [className, setClassName] = useState('');

  useEffect(() => {
    const classes = clsx(styles.CalendarButton, {
      [styles['is-disabled']]: isDisabled,
      [styles['is-selected']]: isSelected,
      [styles['is-rounded']]: isRounded,
      [styles['is-highlighted']]: isHighlighted,
    });

    setClassName(classes);
  }, [isDisabled, isSelected, isRounded, isHighlighted]);

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
