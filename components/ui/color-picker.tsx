import React from 'react'
import { HexColorPicker } from "react-colorful"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <HexColorPicker color={color} onChange={onChange} />
      <input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-2 py-1 w-24"
      />
    </div>
  )
}