import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

const VideoQualityOptions = ({ setQuality }: { setQuality: (quality: string) => void }) => {
  return (
    <Select onValueChange={ setQuality } defaultValue='best'>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="best">Best</SelectItem>
        <SelectItem value="2160p">2160p (4k)</SelectItem>
        <SelectItem value="1440p">1440p (QHD)</SelectItem>
        <SelectItem value="1080p">1080p (FHD)</SelectItem>
        <SelectItem value="720p">720p (HD)</SelectItem>
        <SelectItem value="480p">480p (SD)</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default VideoQualityOptions