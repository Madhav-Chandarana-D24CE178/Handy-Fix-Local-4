export const SkeletonCard = () => {
  return (
    <div className="bg-dark-2 rounded-xl overflow-hidden animate-pulse">
      <div className="h-40 w-full animate-shimmer bg-gradient-to-r from-dark-3 via-dark-4 to-dark-3" style={{ backgroundSize: '200% 100%' }}></div>
      <div className="p-4 space-y-3">
        <div className="h-4 w-2/3 rounded bg-gradient-to-r from-dark-3 via-dark-4 to-dark-3 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
        <div className="h-3 w-1/2 rounded bg-gradient-to-r from-dark-3 via-dark-4 to-dark-3 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
        <div className="h-3 w-4/5 rounded bg-gradient-to-r from-dark-3 via-dark-4 to-dark-3 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
      </div>
    </div>
  )
}
