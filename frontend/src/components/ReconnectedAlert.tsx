export const ReconnectedAlert = () => {
  return (
    <div
      class="mt-4 p-2 bg-green-200 items-center text-green-600 leading-none rounded-full flex lg:inline-flex"
      role="alert"
    >
      <span class="flex rounded-full bg-green-600 text-white uppercase px-2 py-1 text-xs font-bold mr-3">
        Connected
      </span>
      <span class="font-semibold mr-2 text-left flex-auto">
        You're back online
      </span>
    </div>
  );
};
