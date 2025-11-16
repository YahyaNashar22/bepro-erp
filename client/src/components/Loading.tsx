const Loading = () => {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />

        {/* Text */}
        <h1 className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading...
        </h1>
      </div>
    </main>
  );
};

export default Loading;
