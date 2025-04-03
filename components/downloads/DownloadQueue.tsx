"use client"
import React, { useEffect } from 'react'
import { Card } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import Link from 'next/link'
import { DownloadQueue as DownloadQueueType } from '@prisma/client'
import { useToast } from '@/hooks/use-toast'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const DownloadQueue = () => {
  const toast = useToast()
  const [downloads, setDownloads] = React.useState<DownloadQueueType[] | undefined>(undefined)
  const [selectedDownloads, setSelectedDownloads] = React.useState<DownloadQueueType[]>([])

  const fetchQueue = async () => {
    const res = await fetch('/api/download/queue', {
      method: 'POST',
    })

    const body = await res.json()

    setDownloads(body.downloadQueue)
  }

  useEffect(() => {
    fetchQueue()

    setInterval(() => {
      fetchQueue()
    }, 1000)
  }, [])

  const deleteDownloads = async () => {
    selectedDownloads.forEach(async (download, index) => {
      fetch('/api/download/queue/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file: download.file
        })
      }).catch(error => {
        toast.toast({
          title: 'Something went wrong',
          description: 'More info in console',
          variant: 'destructive'
        })
  
        console.log(error)
      })

      if (index === selectedDownloads.length - 1) {
        await fetchQueue()
        setSelectedDownloads([])
      }
    })
  }

  const toggleAll = (isChecked: boolean) => {
    setSelectedDownloads(isChecked && downloads ? [...downloads] : [])
  }

  const toggleSingle = (download: DownloadQueueType, isChecked: boolean) => {
    setSelectedDownloads((prev) =>
      isChecked ? [...prev, download] : prev.filter((f) => f !== download)
    )
  }

  if (downloads === undefined) return (
    <section className='container w-full mx-auto px-4'>
      <h1 className='text-xl font-bold py-4'>Download Queue</h1>
      <Card className='p-4 text-center'>
        Loading...
      </Card>
    </section>
  )

  return (
    <section className='container w-full mx-auto px-4'>
      <h1 className='text-xl font-bold py-4'>Download Queue</h1>
      <Card>
        {
          downloads.length === 0
          ?
          <div className='text-center p-4'>
            <h1 className='font-bold text-xl'>Nothing in queue</h1>
            <p>You can queue a download by getting a url from a <Link href={'https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md'} className='underline'>supported website</Link> and inserting it above.</p>
          </div>
          :
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {/* Check All */}
                    <Input
                      type="checkbox"
                      className="w-4"
                      checked={downloads.length > 0 && selectedDownloads.length === downloads.length}
                      onChange={(e) => toggleAll(e.target.checked)}
                    />
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  downloads.map((download, index) => {
                    return (
                    <TableRow key={index}>
                      <TableCell className='w-8'>
                        {/* Individual Checkboxes */}
                        <Input
                          type="checkbox"
                          className="w-4"
                          checked={selectedDownloads.includes(download)}
                          onChange={(e) => toggleSingle(download, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>
                        { download.status }
                      </TableCell>
                      <TableCell>
                        { download.progress }
                      </TableCell>
                      <TableCell className="font-medium">{ download.file }</TableCell>
                      <TableCell className='flex gap-4 justify-end'>
                        <Button variant={'destructive'} onClick={() => {
                          fetch('/api/download/queue/delete', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                              file: download.file
                            })
                          })
                          .then(data => {
                            fetchQueue()
                          }).catch(error => {
                            toast.toast({
                              title: 'Something went wrong',
                              description: 'More info in console',
                              variant: 'destructive'
                            })

                            console.log(error)
                          })
                        }}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                    )
                  })
                }
              </TableBody>  
            </Table>
            {selectedDownloads.length > 0 && (
              <Card className="fixed bottom-4 p-4 flex flex-col gap-4 left-1/2 -translate-x-1/2 z-10">
                <h1 className="text-center font-bold">
                  Selected {selectedDownloads.length} files
                </h1>
                <div className="flex gap-4">
                  <Button className='w-full' onClick={deleteDownloads} variant={'destructive'}>
                    Delete
                  </Button>
                  {/* <Button>Stop</Button> */}
                  {/* <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className='w-full' variant={'destructive'}>
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className='break-all'>Are you sure you want to delete {selectedDownloads.length} files?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the filesfrom the server.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteFiles}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog> */}
                </div>
              </Card>
            )}
          </>
        }
      </Card>
    </section>
  )
}

export default DownloadQueue