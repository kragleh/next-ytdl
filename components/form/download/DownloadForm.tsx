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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const DownloadForm = () => {
  const toast = useToast()
  const [url, setUrl] = useState<string | null>()
  const [format, setFormat] = useState<string>('mp4')
  const [quality, setQuality] = useState<string>('1080')
  const [downloading, setDownloading] = useState(false)
  const [playlist, setPlaylist] = useState<Array<{ url: string; title: string }>>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<Array<{ url: string; title: string }>>([])

  const downloadVideo = async (downloadUrl: string, videoFormat: string, videoQuality: string) => {
    fetch('/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: downloadUrl,
        format: videoFormat,
        quality: videoQuality
      })
    }).then(() => {
      setDownloading(false)
    }).catch(error => {
      toast.toast({
        title: 'Something went wrong',
        description: 'More info in console',
        variant: 'destructive'
      })

      setDownloading(false)
      console.log(error)
    })
  }

  const handleDownload = async () => {
    setDownloading(true)
    
    try {
      await downloadSchema.parseAsync({ url, format, quality })

      // Won't happen just for error handling
      if (url === undefined || url === null) return
      if (format === undefined || format === null) return
      if (quality === undefined || quality === null) return

      if (url.includes('list=')) {
        // Get all videos from playlist and queue them
        fetch('/api/download/playlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url
          })
        }).then((res) => res.json()).then(async (body) => {
          setPlaylist(body.videos)
          setDownloading(false)
        }).catch(error => {
          toast.toast({
            title: 'Something went wrong',
            description: 'More info in console',
            variant: 'destructive'
          })
    
          setDownloading(false)
          console.log(error)
        })
      } else {
        downloadVideo(url, format, quality)
      }
    } catch (error) {
      if (error instanceof ZodError) {
        toast.toast({ title: error.errors[0].message })
        setDownloading(false)
      } else {
        toast.toast({
          title: 'Something went wrong',
          description: 'More info in console',
          variant: 'destructive'
        })

        console.log(error)
        setDownloading(false)
      }
    }
  }

  const toggleAll = (isChecked: boolean) => {
    setSelectedPlaylist(isChecked && playlist ? [...playlist] : [])
  }

  const toggleSingle = (video: { url: string; title: string }, isChecked: boolean) => {
    setSelectedPlaylist((prev) =>
      isChecked ? [...prev, video] : prev?.filter((f) => f !== video)
    )
  }

  return (
    <>
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
          {
            downloading 
            ?
            <Button className='w-full' onClick={handleDownload} disabled>Fetching Information</Button>
            :
            <Button className='w-full' onClick={handleDownload}>Download</Button>
          }
        </div>
      </section>
      {
        playlist.length > 0 && (
          <Dialog defaultOpen={true}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit playlist</DialogTitle>
                <DialogDescription>
                  Make changes to the playlist or download all.
                </DialogDescription>
              </DialogHeader>

              {/* choose specific videos */}

              <Table divClassname="max-h-[70vh] overflow-y-scroll">
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {/* Check All */}
                      <Input
                        type="checkbox"
                        className="w-4"
                        checked={playlist.length > 0 && selectedPlaylist.length === playlist.length}
                        onChange={(e) => toggleAll(e.target.checked)}
                      />
                    </TableHead>
                    <TableHead>Filename</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playlist.map((video, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell className='w-8'>
                          {/* Individual Checkboxes */}
                          <Input
                            type="checkbox"
                            className="w-4"
                            checked={selectedPlaylist?.includes(video)}
                            onChange={(e) => toggleSingle(video, e.target.checked)}
                          />
                        </TableCell>
                        <TableCell className="font-medium break-all">
                          {video.title}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              <DialogFooter>
                <Button variant={'outline'} onClick={() => {
                  playlist.forEach((video) => {
                    downloadVideo(video.url, format, quality)
                  })
                  setPlaylist([])
                  setSelectedPlaylist([])
                  toast.toast({
                    title: 'Playlist queued',
                  })
                }}>Download All</Button>

                <Button type="submit" onClick={() => {
                  selectedPlaylist.forEach((video) => {
                    downloadVideo(video.url, format, quality)
                  })
                  setPlaylist([])
                  setSelectedPlaylist([])
                  toast.toast({
                    title: 'Selected queued',
                  })
                }}>Download Selected</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      }
    </>
  )
}

export default DownloadForm