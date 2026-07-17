import * as React from "react"

export interface SliderProps {
  value?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  className?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className = '', value = 1, min = 0, max = 100, step = 1, onChange, ...props }, ref) => {
    return (
      <input
        type="range"
        ref={ref}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange?.(parseFloat(e.target.value))}
        className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer ${className}`}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
