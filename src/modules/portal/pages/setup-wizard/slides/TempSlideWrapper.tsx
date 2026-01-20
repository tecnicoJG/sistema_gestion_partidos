import type { ReactNode } from 'react';
import { forwardRef, useEffect, useImperativeHandle } from 'react';

import { BaseSlide } from './BaseSlide';

interface TempSlideWrapperProps {
  isActive: boolean;
  isPast: boolean;
  setValidation: (isValid: boolean) => void;
  children: ReactNode;
}

export interface TempSlideWrapperRef {
  getData: () => undefined;
}

// Temporary wrapper for slides that haven't been refactored yet
export const TempSlideWrapper = forwardRef<TempSlideWrapperRef, TempSlideWrapperProps>(
  ({ isActive, isPast, setValidation, children }, ref) => {
    // Always valid (these are optional slides)
    useEffect(() => {
      if (isActive) setValidation(true);
    }, [setValidation]);

    useImperativeHandle(ref, () => ({
      getData: () => undefined,
    }));

    return (
      <BaseSlide isActive={isActive} isPast={isPast}>
        {children}
      </BaseSlide>
    );
  }
);

TempSlideWrapper.displayName = 'TempSlideWrapper';
