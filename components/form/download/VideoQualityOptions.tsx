import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

const VideoQualityOptions = ({ setQuality }: { setQuality: (quality: string) => void }) => {
  return (
    <Select onValueChange={ setQuality } defaultValue='2160'>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="2160">2160p (4k)</SelectItem>
        <SelectItem value="1440">1440p (QHD)</SelectItem>
        <SelectItem value="1080">1080p (FHD)</SelectItem>
        <SelectItem value="720">720p (HD)</SelectItem>
        <SelectItem value="480">480p (SD)</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default VideoQualityOptions