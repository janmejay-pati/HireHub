import { motion } from 'framer-motion';

const Skeleton = ({ className = '', variant = 'rectangle', lines = 1 }) => {
  const baseClasses = 'bg-slate-200 animate-pulse rounded';

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={`${baseClasses} h-4`}
            style={{ width: `${Math.random() * 40 + 60}%` }}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <motion.div
        className={`${baseClasses} ${className}`}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity
        }}
      />
    );
  }

  // Default rectangle
  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{
        duration: 1.5,
        repeat: Infinity
      }}
    />
  );
};

// Job Card Skeleton
export const JobCardSkeleton = () => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex-1">
        <Skeleton className="h-4 w-20 mb-3" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>

    <div className="flex gap-4 mb-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>

    <div className="space-y-2 mb-6">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>

    <Skeleton className="h-4 w-24" />
  </div>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <div className="rounded-3xl bg-white p-6 shadow-lg">
    <Skeleton className="h-4 w-24 mb-4" />
    <Skeleton className="h-8 w-16 mb-2" />
    <Skeleton className="h-4 w-20" />
  </div>
);

export default Skeleton;