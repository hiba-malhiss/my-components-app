import React from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import styles from './Button.module.scss';

interface ButtonProps {
  onClick: () => void;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
  appearance?: 'plainDefault' | 'primary' | 'secondary';
  textAlign?: 'left' | 'right' | 'center';
  display?: 'inline' | 'block';
  isDisabled?: boolean;
  children: React.ReactNode;
  className?: string;
  isSelected?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  size = 'medium',
  iconLeft,
  iconRight,
  appearance = 'secondary',
  textAlign = 'center',
  display = 'inline',
  isDisabled = false,
  children,
  className,
  isSelected = false,
}) => {
  const buttonClass = clsx(
    styles.Button,
    styles[`Button--${size}Size`],
    styles[`Button--withText`],
    styles[`Button--${appearance}Appearance`],
    [`Button--${textAlign}TextAlign`],
    [`Button--${display}Display`],
    {
      [styles['is-disabled']]: isDisabled,
      [styles['is-selected']]: isSelected,
      [styles['has-error']]: false,
      [styles['is-hidden']]: false,
    },
    className
  );

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={isDisabled}
    >
      {iconLeft && (
        <span className={clsx(styles['Button-icon'], styles['Button-icon--left'])}>
          <FontAwesomeIcon icon={iconLeft}/>
        </span>
      )}
      {children}
      {iconRight && (
        <span className={clsx(styles['Button-icon'], styles['Button-icon--right'])}>
          <FontAwesomeIcon icon={iconRight}/>
        </span>
      )}
    </button>
  );
};

export default Button;
