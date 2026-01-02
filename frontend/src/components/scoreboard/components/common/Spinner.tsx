import clsx from "clsx";

type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-[3px]",
  lg: "h-8 w-8 border-4",
};

export const Spinner = ({ size = "md", className, label}: Props) => {
  return (
    <div className={clsx("inline-flex items-center gap-2", className)}>
      <span
        aria-label={label}
        role="status"
        className={clsx(
          "inline-block rounded-full animate-spin",
          sizeMap[size],
          "border-[#C00000]/30 border-t-[#C00000] border-r-[#B3995D]"
        )}
      />
      {label ? (
        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-black/50">
          {label}
        </span>
      ) : null}
    </div>
  );
}
