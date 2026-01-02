import type { UIPlayerRow } from "../../types";
import { Spinner } from "../common/Spinner";

type DeletePlayerModalProps = {
  open: boolean;
  player?: UIPlayerRow | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  confirmDisabled?: boolean;
  loading: boolean;
};

export const DeletePlayerModal = ({
  open,
  player,
  onClose,
  onConfirm,
  confirmDisabled,
  loading
}: DeletePlayerModalProps) => {
  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Delete player confirmation" className="fixed inset-0 z-120">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close delete dialog"
      />
      <div className="absolute left-1/2 top-1/2 w-130 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.35)] border border-black/10">
        <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
          <div className="text-[13px] font-extrabold tracking-[0.28em] text-[#C00000]">
            DELETE PLAYER
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-md border border-black/15 hover:bg-black/3 flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="text-sm text-black/70">
            This will permanently delete{" "}
            <span className="font-semibold text-black">
              {player?.firstName} {player?.lastName}
            </span>
            {player?.jersey ? (
              <>
                {" "}
                (<span className="font-semibold">#{player.jersey}</span>)
              </>
            ) : null}
            . Continue?
          </div>
        </div>

        <div className="px-6 py-5 border-t border-black/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 w-28 rounded-md border border-black/15 text-sm font-semibold text-black/70 hover:bg-black/3"
          >
            CANCEL
          </button>

          <button
            type="button"
            disabled={!!confirmDisabled || loading }
            onClick={onConfirm}
            className="h-10 px-6 rounded-md w-28 bg-[#C00000] text-white text-sm font-extrabold tracking-[0.16em] uppercase hover:bg-[#A00000] disabled:opacity-60 disabled:hover:bg-[#C00000]"
          >
            { loading ? (
              <Spinner size="md" />
            ) : (
              <p>DELETE</p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}