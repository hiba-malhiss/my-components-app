import React, { useRef } from 'react';
import styles from './StringInput.module.scss';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function StringInput({
  value,
  onClick,
  onChange,
  placeholder = '',
  iconLeft = null,
  iconRight = null,
  onIconClick,
  isCalculated = false,
  isDisabled = false,
  readOnly = false,
  onFocus,
  type = 'text'
}) {
  const inputRef = useRef(null);

  const handleFocus = () => {
    if (!isCalculated && !isDisabled) {
      inputRef.current?.select();
      onFocus?.();
    }
  };

  return (
    <div className={styles.StringInput}>
      <div
        className={clsx(
          styles['StringInput-wrapper'],
          isCalculated && styles['is-calculated'],
          isDisabled && styles['is-disabled'],
          iconLeft && styles['has-iconLeft'],
          iconRight && styles['has-iconRight']
        )}
      >
        {iconLeft && (
          <div
            className={clsx(
              styles['StringInput-iconLeft'],
              onIconClick && styles['clickable']
            )}
            onClick={!isDisabled && !isCalculated && onIconClick}
          >
            <FontAwesomeIcon icon={iconLeft} />
          </div>
        )}
        <input
          onClick={!isDisabled && !isCalculated && onClick}
          ref={inputRef}
          className={clsx(
            styles['StringInput-input'],
            isCalculated && styles['is-calculated'],
            isDisabled && styles['is-disabled']
          )}
          type={type}
          readOnly={readOnly}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          disabled={isCalculated || isDisabled}
        />
        {iconRight && (
          <div
            className={clsx(
              styles['StringInput-iconRight'],
              onIconClick && styles['clickable']
            )}
            onClick={!isDisabled && !isCalculated && onIconClick}
          >
            <FontAwesomeIcon icon={iconRight} />
          </div>
        )}
      </div>
    </div>
  );
}
