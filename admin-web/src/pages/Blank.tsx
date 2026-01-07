export default function Blank() {
  return (
    <div className="flex justify-center items-center min-h-[480px] bg-gray-50 dark:bg-gray-900">
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full sm:max-w-[630px] max-w-[500px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Unauthorized
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Only owners of this system are allowed to register new admin
            accounts.
          </p>
        </div>
      </div>
    </div>
  );
}
