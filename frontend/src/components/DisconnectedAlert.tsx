export const DisconnectedAlert = () => {
  return (
    <div
      class="text-danger-600 mt-4 flex items-center rounded-full bg-red-200 p-2 leading-none lg:inline-flex"
      role="alert"
    >
      <span class="mr-3 flex rounded-full bg-red-600 px-2 py-1 text-xs font-bold uppercase text-white">
        Not connected
      </span>
      <span class="mr-2 flex-auto text-left font-semibold">
        Messages won't be delivered
      </span>
    </div>
  );
};
