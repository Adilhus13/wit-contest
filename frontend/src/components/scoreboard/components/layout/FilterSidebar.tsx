// UI-only component used for layout/design; no filtering logic implemented by requirement.

export const FilterSidebar = () => {
  return (
    <aside className="w-75 relative overflow-hidden bg-[linear-gradient(180deg,#C00000_0%,#6B0000_85%)] px-7 py-10">
      <div className="pointer-events-none absolute -left-24 top-16 h-0.5 w-130 rotate-[-16deg] bg-white/20" />

      <h2  className="text-white font-extrabold tracking-[0.22em] text-[11px] uppercase">
        USER SEGMENTS
      </h2 >

      <div className="mt-5 space-y-3 text-white/95 text-[12px] font-semibold">
        <label className="flex items-center gap-3">
          <input type="checkbox" className="h-4 w-4 rounded border-white/50 bg-white/10" />
          <span>Lorem Ipsum Dolor</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="h-4 w-4 rounded border-white/50 bg-white/10" />
          <span>Sit Amet</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="h-4 w-4 rounded border-white/50 bg-white/10" />
          <span>Vivamus Interdum</span>
        </label>
      </div>

      <div className="mt-12 text-white font-extrabold tracking-[0.22em] text-[11px] uppercase">
        ALIQUAM ORNARE
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <input className="h-10 rounded-lg bg-white px-3 text-sm outline-none text-black" placeholder="From" />
        <input className="h-10 rounded-lg bg-white px-3 text-sm outline-none text-black" placeholder="To" />
      </div>

      <div className="mt-5 flex gap-4">
        <button type="button" className="flex-1 h-10 rounded-full bg-[#B3995D] text-white text-[11px] font-extrabold tracking-[0.22em] shadow-[0_10px_18px_rgba(0,0,0,0.18)] uppercase">
          APPLY
        </button>
        <button type="button" className="flex-1 h-10 rounded-full bg-[#6B0000] text-white text-[11px] font-extrabold tracking-[0.22em] shadow-[0_10px_18px_rgba(0,0,0,0.18)] uppercase">
          CLEAR
        </button>
      </div>

      <div className="mt-12 text-white font-extrabold tracking-[0.22em] text-[11px] uppercase">
        NAM GRAVIDA DOLOR
      </div>

      <div className="mt-5">
        <input className="h-10 w-full rounded-lg bg-white px-3 text-sm outline-none text-black" placeholder="Type Here" />
      </div>
    </aside>
  );
}
