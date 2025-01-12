"use client"
import React, { useEffect } from 'react'
import { Card } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import DeleteDownloadAlert from './DeleteDownloadAlert'
import Link from 'next/link'

const DownloadQueue = ({ userId }: { userId: string }) => {
  const [files, setFiles] = React.useState<string[] | undefined>(undefined)

  const fetchQueue = async () => {
    const res = await fetch('/api/download/queue', {
      method: 'POST',
    })

    const body = await res.json()

    setFiles(body.files)
  }

  useEffect(() => {
    fetchQueue()
  }, [])

  if (files === undefined) return (
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
          files.length === 0
          ?
          <div className='text-center p-4'>
            <h1 className='font-bold text-xl'>Nothing in queue</h1>
            <p>You can queue a download by getting a url from a <Link href={'https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md'} className='underline'>supported website</Link> and inserting it above.</p>
          </div>
          :
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filename</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                files.map((file, index) => {
                  return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{ file }</TableCell>
                    <TableCell className='flex gap-4 justify-end'>
                      <Button variant={'outline'} asChild>
                        <Link href={`/downloads/${userId}/${file}`} target='_blank'>
                          Preview
                        </Link>
                      </Button>
                      <Button asChild>
                        <a href={`/downloads/${userId}/${file}`} download={file}>
                          Download
                        </a>
                      </Button>
                      {/* <DeleteDownloadAlert refreshDownloads={fetchFiles} file={file} /> */}
                    </TableCell>
                  </TableRow>
                  )
                })
              }
            </TableBody>  
          </Table>
        }
      </Card>
    </section>
  )

  return (
    <section className='container w-full mx-auto px-4'>
      <h1 className='text-xl font-bold py-4'>Download History</h1>
      <Card>
        {
          files.length === 0
          ?
          <div className='text-center p-4'>
            <h1 className='font-bold text-xl'>No downloads found</h1>
            <p>You can make a download by getting a url from a <Link href={'https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md'} className='underline'>supported website</Link> and inserting it above.</p>
          </div>
          :
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filename</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                files.map((file, index) => {
                  return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{ file }</TableCell>
                    <TableCell className='flex gap-4 justify-end'>
                      <Button variant={'outline'} asChild>
                        <Link href={`/downloads/${userId}/${file}`} target='_blank'>
                          Preview
                        </Link>
                      </Button>
                      <Button asChild>
                        <a href={`/downloads/${userId}/${file}`} download={file}>
                          Download
                        </a>
                      </Button>
                      <DeleteDownloadAlert refreshDownloads={fetchFiles} file={file} />
                    </TableCell>
                  </TableRow>
                  )
                })
              }
            </TableBody>  
          </Table>
        }
      </Card>
    </section>
  )
}

export default DownloadQueue