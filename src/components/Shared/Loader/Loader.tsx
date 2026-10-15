
const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full gap-3">
      {/* Spinner */}
      <div className="size-7 border-4 border-primary-10 border-t-transparent rounded-full animate-spin"></div>

      {/* Text */}
      <span className="text-primary-10 font-medium text-lg animate-pulse">
        Loading...
      </span>
    </div>
  );
};

export default Loader;
