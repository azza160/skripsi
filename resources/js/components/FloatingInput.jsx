"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

export function FloatingInput({ id, name, type, label, value, onChange, icon, rightIcon }) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  useEffect(() => {
    setHasValue(value.length > 0)
  }, [value])

  return (
    <div className="relative">
      <div className="relative group">
        <div className="absolute left-0 top-0 h-full flex items-center pl-4 pointer-events-none">{icon}</div>

        <Input
          id={id}
          name={name || id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full pt-7 pb-3 pl-12 pr-4 rounded-lg border border-[hsl(214.3,20%,90%)] bg-[hsl(214.3,20%,98%)] focus:border-[hsl(252,94%,56%)] focus:ring-0 transition-all duration-300 ${
            rightIcon ? "pr-12" : ""
          }`}
        />

        {rightIcon}

        <label
          htmlFor={id}
          className={`absolute left-12 transition-all duration-200 pointer-events-none ${
            isFocused || hasValue
              ? "top-1.5 text-xs text-[hsl(252,94%,56%)] font-medium"
              : "top-1/2 -translate-y-1/2 text-[hsl(215.4,16.3%,40%)]"
          }`}
        >
          {label}
        </label>

        <div
          className={`absolute bottom-0 left-0 h-0.5 w-0 bg-[hsl(252,94%,56%)] transition-all duration-300 ${isFocused ? "w-full" : ""}`}
        />
      </div>
    </div>
  )
}
