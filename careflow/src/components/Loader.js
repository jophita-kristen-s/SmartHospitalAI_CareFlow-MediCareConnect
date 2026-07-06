import React from 'react';
import { motion } from 'framer-motion';

/** Animated skeleton block */
export function Skeleton({ width = '100%', height = 18, radius = 8, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

/** Full-page dashboard skeleton */
export function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton width={56} height={56} radius={16} />
        <div className="space-y-2 flex-1">
          <Skeleton width="40%" height={14} />
          <Skeleton width="25%" height={22} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0,1,2].map(i => <Skeleton key={i} height={90} radius={20} />)}
      </div>
      <Skeleton height={140} radius={20} />
      <Skeleton height={110} radius={20} />
    </div>
  );
}

/** Small inline spinner */
export function Spinner({ size = 20, color = '#00bcd4' }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      style={{
        width: size, height: size,
        border: `2px solid ${color}30`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
        flexShrink: 0,
      }}
    />
  );
}
