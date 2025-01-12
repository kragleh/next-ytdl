"use client"
import React, { useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import Link from 'next/link'
import DeleteDownloadAlert from './DeleteDownloadAlert'
import { Input } from '../ui/input'
import { BsThreeDots } from 'react-icons/bs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'

const DownloadHistory = ({ userId }: { userId: string }) => {
  const [files, setFiles] = React.useState<string[] | undefined>(undefined)
  const [selectedFiles, setSelectedFiles] = React.useState<string[] | undefined>(undefined)

  const fetchFiles = async () => {
    const res = await fetch('/api/download/history', {
      method: 'POST',
    })

    const body = await res.json()

    setFiles(body.files)
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  if (files === undefined) return (
    <section className='container w-full mx-auto px-4'>
      <h1 className='text-xl font-bold py-4'>Download History</h1>
      <Card className='p-4 text-center'>
        Loading...
      </Card>
    </section>
  )

  return (
    <section className='container w-full mx-auto px-4'>
      <h1 className='text-xl font-bold pt-8 pb-4'>Download History</h1>
      <Card>
        {
          files.length === 0
          ?
          <div className='text-center p-4'>
            <h1 className='font-bold text-xl'>No downloads found</h1>
            <p>You can make a download by getting a url from a <Link href={'https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md'} className='underline'>supported website</Link> and inserting it above.</p>
          </div>
          :
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Input type='checkbox' className='w-4' onChange={() => { selectedFiles ? setSelectedFiles(undefined) : setSelectedFiles(['test']) }} />
                  </TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  files.map((file, index) => {
                    return (
                    <TableRow key={index}>
                      <TableCell>
                        <Input type='checkbox' className='w-4' onChange={() => {/* add to array on checked */}} />
                      </TableCell>
                      <TableCell className="font-medium break-all">{ file }</TableCell>
                      <TableCell className='flex gap-4 justify-end items-center m-2'>
                        <DropdownMenu>
                          <DropdownMenuTrigger className='flex flex-col items-center justify-center'>
                            <BsThreeDots size={24} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className='flex flex-col gap-1'>
                            <Button variant={'outline'} className='w-full' asChild>
                              <Link href={`/downloads/${userId}/${file}`} target='_blank'>
                                Preview
                              </Link>
                            </Button>
                            <Button className='w-full' asChild>
                              <a href={`/downloads/${userId}/${file}`} download={file}>
                                Download
                              </a>
                            </Button>
                            <DeleteDownloadAlert refreshDownloads={fetchFiles} file={file} />
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {/* <Button variant={'outline'} asChild>
                          <Link href={`/downloads/${userId}/${file}`} target='_blank'>
                            Preview
                          </Link>
                        </Button>
                        <Button asChild>
                          <a href={`/downloads/${userId}/${file}`} download={file}>
                            Download
                          </a>
                        </Button>
                        <DeleteDownloadAlert refreshDownloads={fetchFiles} file={file} /> */}
                      </TableCell>
                    </TableRow>
                    )
                  })
                }
              </TableBody>  
            </Table>
            {
              selectedFiles &&
                selectedFiles.length > 0 &&
                  <Card className='fixed bottom-4 p-4 flex flex-col gap-4 left-1/2 -translate-x-1/2 z-10'>
                    <h1 className='text-center font-bold'>Selected { selectedFiles.length } files</h1>
                    <div className='flex gap-4'>
                      <Button>Download</Button>
                      <Button variant={'destructive'}>Delete</Button>
                    </div>
                  </Card>
            }
          </>
        }
      </Card>
    </section>
  )
}

export default DownloadHistory