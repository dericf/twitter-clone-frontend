export const LoadingOverlay = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center text-white bg-blueGray-700">
			<h1 className="text-6xl ">Loading</h1>
      <svg
        className="h-24 w-24 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </div>
  );
};