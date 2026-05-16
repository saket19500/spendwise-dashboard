export function ProfileScreen() {
  return (
    <div className="px-4 pt-6 pb-28">
      <h1 className="text-xl font-medium tracking-tight text-[#2c2c2a]">Profile</h1>

      <div className="mt-6 flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EEEDFE] text-2xl font-medium text-[#534AB7]">
          AK
        </div>
        <div className="mt-3 text-base font-medium text-[#2c2c2a]">Arjun Kumar</div>
        <div className="text-xs text-[#888780]">arjun@spendwise.app</div>
      </div>

      <div className="mt-8 rounded-2xl bg-white border border-[#e8e7e3] p-6 text-center">
        <div className="text-sm font-medium text-[#2c2c2a]">Settings</div>
        <div className="mt-1 text-xs text-[#888780]">Coming soon</div>
      </div>
    </div>
  );
}
