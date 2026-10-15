
const StatusCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg p-4 space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="size-[30px] bg-surface-40 rounded-sm" />
        <div className="h-6 w-16 bg-gray-200 rounded-sm" />
      </div>

      <div className="space-y-2">
        <div className="h-8 w-20 bg-gray-300 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
    </div>
    );
};

export default StatusCardSkeleton;