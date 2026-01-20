import type { ReactNode } from 'react';

import { CustomScrollbar } from '../../../components/CustomScrollbar';

interface BaseSlideProps {
  isActive: boolean;
  isPast: boolean;
  children: ReactNode;
}

export function BaseSlide({ isActive, isPast, children }: BaseSlideProps) {
  return (
    <div
      className={`absolute inset-0 transition-all duration-500 ease-in-out ${
        isActive
          ? 'opacity-100 translate-x-0'
          : isPast
            ? 'opacity-0 -translate-x-full pointer-events-none'
            : 'opacity-0 translate-x-full pointer-events-none'
      }`}
    >
      <CustomScrollbar className="h-full">
        <div className="min-h-full flex items-center py-6">
          <div className="w-full">{children}</div>
        </div>
      </CustomScrollbar>
    </div>
  );
}
