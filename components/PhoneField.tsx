"use client";

import { useState } from "react";
import { COUNTRY_CODES, flagEmoji, splitPhone } from "@/lib/countryCodes";

type Props = {
  id: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
};

/**
 * A phone field with a country-code dropdown (all countries, flag + dial
 * code) paired with the local number. Emits a single combined value like
 * "+44 7911 123456" via onChange, matching what plain <input type="tel">
 * fields elsewhere in the site store.
 */
export default function PhoneField({
  id,
  label,
  required,
  disabled,
  value,
  onChange,
}: Props) {
  const initial = splitPhone(value);
  const [dial, setDial] = useState(initial.dial);
  const [number, setNumber] = useState(initial.number);

  function emit(nextDial: string, nextNumber: string) {
    onChange(nextNumber ? `${nextDial} ${nextNumber}`.trim() : "");
  }

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {required ? <span className="text-maroon-500">*</span> : null}
      </label>
      <div className="flex gap-2">
        <select
          aria-label="Country code"
          value={dial}
          disabled={disabled}
          onChange={(e) => {
            setDial(e.target.value);
            emit(e.target.value, number);
          }}
          className="field-input w-[92px] shrink-0 px-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={`${c.iso2}-${c.dial}`} value={c.dial}>
              {flagEmoji(c.iso2)} {c.name} {c.dial}
            </option>
          ))}
        </select>
        <input
          id={id}
          type="tel"
          required={required}
          disabled={disabled}
          value={number}
          onChange={(e) => {
            setNumber(e.target.value);
            emit(dial, e.target.value);
          }}
          className="field-input flex-1 disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="7911 123456"
        />
      </div>
    </div>
  );
}
