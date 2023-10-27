export const DisconnectedAlert = () => {
  return (
    <div
      class="mt-4 p-2 bg-red-200 items-center text-red-600 leading-none rounded-full flex lg:inline-flex"
      role="alert"
    >
      <span class="flex rounded-full bg-red-600 text-white uppercase px-2 py-1 text-xs font-bold mr-3">
        Not connected
      </span>
      <span class="font-semibold mr-2 text-left flex-auto">
        Messages won't be delivered
      </span>
    </div>
  );
};
