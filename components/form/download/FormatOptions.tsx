import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

const FormatOptions = ({ setFormat }: { setFormat: (format: string) => void }) => {
  return (
    <Select onValueChange={ setFormat } defaultValue='mp4'>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="mp4">MP4 (Video)</SelectItem>
        <SelectItem value="mp3">MP3 (Audio)</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default FormatOptions