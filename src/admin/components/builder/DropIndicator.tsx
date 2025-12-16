'use client';

import React from 'react';

interface DropIndicatorProps {
  position: 'above' | 'below';
}

export function DropIndicator({ position }: DropIndicatorProps) {
  return (
    <div
      className={`absolute left-0 right-0 z-50 h-0.5 bg-indigo-500 ${
        position === 'above' ? 'top-0' : 'bottom-0'
      }`}
      style={{
        transform: position === 'above' ? 'translateY(-50%)' : 'translateY(50%)',
      }}
    />
  );
}

