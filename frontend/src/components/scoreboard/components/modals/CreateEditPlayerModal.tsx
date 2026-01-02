import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { ModalMode, PlayerFormValues, UIPlayerRow } from "../../types";
import { parseNum, toFormValues } from "../../mappers";
import { Spinner } from "../common/Spinner";

type CreateEditPlayerModalProps = {
  open: boolean;
  mode: ModalMode;
  initial?: UIPlayerRow | null;
  onClose: () => void;
  onSubmit: (values: PlayerFormValues) => void;
  loading: boolean;
};

export const CreateEditPlayerModal = ({ open, mode, initial, onClose, onSubmit, loading }: CreateEditPlayerModalProps) => {
  const title = mode === "create" ? "CREATE PLAYER" : "EDIT PLAYER";

  const initialValues = useMemo(() => toFormValues(initial), [initial]);
  const [values, setValues] = useState<PlayerFormValues>(initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open) {
      setValues(initialValues);
      setTouched({});
    }
  }, [open, initialValues]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!values.firstName.trim()) e.firstName = "Required";
    if (!values.lastName.trim()) e.lastName = "Required";
    if (values.jerseyNumber === "" || values.jerseyNumber < 0) e.jerseyNumber = "Required";
    if (values.heightIn as number > 99) e.heightIn = "Height must be less than 100";
    return e;
  }, [values]);

  const canSubmit = Object.keys(errors).length === 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal"
      />

      <div  role="dialog" aria-modal="true" aria-label="Edit player" className="absolute left-1/2 top-1/2 w-180 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.35)] border border-black/10">
        <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
          <div className="text-[13px] font-extrabold tracking-[0.28em] text-[#C00000]">
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-md border border-black/15 hover:bg-black/3 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="FIRST NAME"
              error={touched.firstName ? errors.firstName : undefined}
            >
              <input
                name='firstName'
                value={values.firstName}
                onChange={(e) => setValues((p) => ({ ...p, firstName: e.target.value }))}
                onBlur={() => setTouched((p) => ({ ...p, firstName: true }))}
                className={inputCls(!!(touched.firstName && errors.firstName))}
              />
            </Field>

            <Field
              label="LAST NAME"
              error={touched.lastName ? errors.lastName : undefined}
            >
              <input
                name='lastName'
                value={values.lastName}
                onChange={(e) => setValues((p) => ({ ...p, lastName: e.target.value }))}
                onBlur={() => setTouched((p) => ({ ...p, lastName: true }))}
                className={inputCls(!!(touched.lastName && errors.lastName))}
              />
            </Field>

            <Field
              label="JERSEY #"
              error={touched.jerseyNumber ? errors.jerseyNumber : undefined}
            >
              <input
                name='jerseyNumber'
                inputMode="numeric"
                value={values.jerseyNumber}
                onChange={(e) =>
                  setValues((p) => ({ ...p, jerseyNumber: parseNum(e.target.value) }))
                }
                onBlur={() => setTouched((p) => ({ ...p, jerseyNumber: true }))}
                className={inputCls(!!(touched.jerseyNumber && errors.jerseyNumber))}
              />
            </Field>

            <Field label="POSITION">
              <input
                name='position'
                value={values.position}
                onChange={(e) => setValues((p) => ({ ...p, position: e.target.value }))}
                className={inputCls(false)}
              />
            </Field>

            <Field label="STATUS">
              <select
                name='status'
                value={values.status}
                onChange={(e) => setValues((p) => ({ ...p, status: e.target.value as PlayerFormValues["status"] }))}
                className={inputCls(false)}
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </Field>

            <Field 
            label="HEIGHT (IN)"
            error={touched.heightIn ? errors.heightIn : undefined}

            >
              <input
                name='height'
                inputMode="numeric"
                value={values.heightIn}
                onChange={(e) =>
                  setValues((p) => ({ ...p, heightIn: parseNum(e.target.value) }))
                }
                onBlur={() => setTouched((p) => ({ ...p, heightIn: true }))}
                className={inputCls(!!(touched.heightIn && errors.heightIn))}
              />
            </Field>

            <Field label="WEIGHT (LB)">
              <input
                name='weight'
                inputMode="numeric"
                value={values.weightLb}
                onChange={(e) =>
                  setValues((p) => ({ ...p, weightLb: parseNum(e.target.value) }))
                }
                className={inputCls(false)}
              />
            </Field>

            <Field label="AGE">
              <input
                name='age'
                inputMode="numeric"
                value={values.age}
                onChange={(e) => setValues((p) => ({ ...p, age: parseNum(e.target.value) }))}
                className={inputCls(false)}
              />
            </Field>

            <Field label="EXPERIENCE (YRS)">
              <input
                name='experienceYears'
                inputMode="numeric"
                value={values.experienceYears}
                onChange={(e) =>
                  setValues((p) => ({ ...p, experienceYears: parseNum(e.target.value) }))
                }
                className={inputCls(false)}
              />
            </Field>

            <Field label="COLLEGE">
              <input
                name='college'
                value={values.college}
                onChange={(e) => setValues((p) => ({ ...p, college: e.target.value }))}
                className={inputCls(false)}
              />
            </Field>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-black/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 w-23 rounded-md border border-black/15 text-sm font-semibold text-black/70 hover:bg-black/3"
          >
            CANCEL
          </button>

          <button
            type="button"
            disabled={!canSubmit || loading}
            onClick={() => {
              setTouched({
                firstName: true,
                lastName: true,
                jerseyNumber: true,
              });
              if (!canSubmit) return;
              onSubmit(values);
            }}
            className={clsx(
              "h-10 px-6 w-23 rounded-md text-sm font-extrabold tracking-[0.16em] uppercase",
              canSubmit
                ? "bg-[#C00000] text-white hover:bg-[#A00000]"
                : "bg-black/10 text-black/30"
            )}
          >
            { loading ? (
              <Spinner size="md" />
            ) : (
              <p>SAVE</p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <div className="text-[11px] font-extrabold tracking-[0.22em] uppercase text-black/60">
        {label}
      </div>
      <div className="mt-2">{children}</div>
      {error ? <div className="mt-1 text-xs font-semibold text-[#C00000]">{error}</div> : null}
    </div>
  );
}

const inputCls = (hasError: boolean) => {
  return clsx(
    "h-10 w-full rounded-md border px-3 text-sm outline-none",
    hasError ? "border-[#C00000]" : "border-black/20",
    "focus:border-black/40"
  );
}
