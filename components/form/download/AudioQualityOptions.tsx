import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

const AudioQualityOptions = ({ setQuality }: { setQuality: (quality: string) => void }) => {
  return (
    <Select onValueChange={ setQuality } defaultValue='best'>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="best">Best</SelectItem>
        <SelectItem value="320kbps">320kbps (High)</SelectItem>
        <SelectItem value="192kbps">192kbps (Medium)</SelectItem>
        <SelectItem value="128kbps">128kbps (Low)</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default AudioQualityOptions