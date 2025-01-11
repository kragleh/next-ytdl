"use client"
import React, { useState } from 'react'
import VideoQualityOptions from './VideoQualityOptions'
import FormatOptions from './FormatOptions'
import AudioQualityOptions from './AudioQualityOptions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { downloadSchema } from '@/lib/zod'
import { ZodError } from 'zod'

const DownloadForm = () => {
  const toast = useToast()
  const [url, setUrl] = useState<string | null>()
  const [format, setFormat] = useState<string | null>('mp4')
  const [quality, setQuality] = useState<string | null>('best')

  const handleDownload = () => {
    // if (quality !== 'best') {
    //   toast.toast({
    //     title: 'More quality options comming soon!'
    //   })
    //   return
    // }

    try {
      downloadSchema.parse({ url, format, quality })

      fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          format,
          quality
        })
      })
      .then(response => {console.log(response); response.json()})
      .then(data => {
        console.log(data)
        toast.toast({
          title: 'Download started',
        })
      })
      .catch(error => {
        console.log(error)
        toast.toast({
          title: 'Something went wrong',
          description: 'More info in console',
          variant: 'destructive'
        })
      })
    } catch (error) {
      if (error instanceof ZodError) {
        toast.toast({
          title: error.errors[0].message,
        })
      } else {
        toast.toast({
          title: 'Something went wrong',
          description: 'More info in console',
          variant: 'destructive'
        })

        console.log(error)
      }
    }
  }

  return (
    <section className='container w-full mx-auto pt-32 pb-16 px-4 flex flex-col gap-4'>
      <Input type='text' placeholder='https://www.youtube.com/watch?v=dQw4w9WgXcQ' onChange={(e) => setUrl(e.target.value)} />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='flex items-center gap-2'>
          <Label>Format</Label>
          <FormatOptions setFormat={setFormat} />
        </div>
        <div className='flex items-center gap-2'>
          <Label>Quality</Label>
          {
            format == "mp4"
            ?
            <VideoQualityOptions setQuality={setQuality} />
            :
            <AudioQualityOptions setQuality={setQuality} />
          }
        </div>
        <Button className='w-full' onClick={handleDownload}>Download</Button>
      </div>
    </section>
  )
}

export default DownloadForm