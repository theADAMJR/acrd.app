const SkeletonMessage: React.FunctionComponent = () => {
  return (    
    <div className="rounded-md px-5 py-2 max-w-sm w-full">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-bg-tertiary h-10 w-10"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-bg-tertiary rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-bg-tertiary rounded"></div>
            <div className="h-4 bg-bg-tertiary rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default SkeletonMessage;