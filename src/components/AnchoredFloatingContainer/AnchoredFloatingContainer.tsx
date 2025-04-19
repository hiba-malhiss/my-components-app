import React, { useEffect, useRef } from 'react';
import styles from './AnchoredFloatingContainer.module.scss';
import clsx from 'clsx';

type AnchoredFloatingContainerAnchor = 'left' | 'right';

interface Props {
  isVisible?: boolean;
  fullWidth?: boolean;
  anchor?: AnchoredFloatingContainerAnchor;
  anchorElement?: HTMLElement | null;
  onVisibilityChange?: (visible: boolean) => void;
  children: React.ReactNode;
}

const AnchoredFloatingContainer: React.FC<Props> = ({
  isVisible = false,
  fullWidth = false,
  anchor = 'left',
  anchorElement = null,
  onVisibilityChange,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getFocusableElements = (element: HTMLElement | null): HTMLElement[] =>
    element
      ? Array.from(
        element.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      )
      : [];

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onVisibilityChange?.(false);
      anchorElement?.focus();
    }
  };

  const handleTab = (event: KeyboardEvent) => {
    if (!anchorElement || !containerRef.current) return;

    const focusables = getFocusableElements(containerRef.current);
    const anchorFocusables = getFocusableElements(anchorElement);

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === focusables[0]) {
          anchorFocusables[0]?.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === anchorFocusables[0]) {
          focusables[0]?.focus();
          event.preventDefault();
        }
      }
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node) &&
      isVisible
    ) {
      onVisibilityChange?.(false);
      anchorElement?.focus();
    }
  };

  useEffect(() => {
    if (isVisible) {
      window.addEventListener('keyup', handleEscape);
      window.addEventListener('keydown', handleTab);
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('keyup', handleEscape);
      window.removeEventListener('keydown', handleTab);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isVisible]);

  const className = clsx(styles.AnchoredFloatingContainer, {
    [styles['AnchoredFloatingContainer--fullWidth']]: fullWidth,
    [styles[`AnchoredFloatingContainer--${anchor}Anchor`]]: anchor,
    [styles['is-visible']]: isVisible,
  });

  return (
    <nav className={className} ref={containerRef}>
      {children}
    </nav>
  );
};

export default AnchoredFloatingContainer;
