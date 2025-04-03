import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

const AudioQualityOptions = ({ setQuality }: { setQuality: (quality: string) => void }) => {
  return (
    <Select onValueChange={ setQuality } defaultValue='320K'>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="320K">320kbps (High)</SelectItem>
        <SelectItem value="192K">192kbps (Medium)</SelectItem>
        <SelectItem value="128K">128kbps (Low)</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default AudioQualityOptions