"use client"
import React, { useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import Link from 'next/link'
import DeleteDownloadAlert from './DeleteDownloadAlert'
import { Input } from '../ui/input'
import { BsThreeDots } from 'react-icons/bs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'


const DownloadHistory = ({ userId }: { userId: string }) => {
  const toast = useToast()
  const [files, setFiles] = React.useState<string[] | undefined>(undefined)
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([])

  const fetchFiles = async () => {
    const res = await fetch("/api/download/history", {
      method: "POST",
    })

    const body = await res.json()

    setFiles(body.files)
  }

  useEffect(() => {
    fetchFiles()

    setInterval(() => {
      fetchFiles()
    }, 3000)
  }, [])

  const deleteFiles = async () => {
    selectedFiles.forEach(async (file, index) => {
      fetch('/api/download/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file
        })
      }).catch(error => {
        toast.toast({
          title: 'Something went wrong',
          description: 'More info in console',
          variant: 'destructive'
        })
  
        console.log(error)
      })

      if (index === selectedFiles.length - 1) {
        await fetchFiles()
        setSelectedFiles([])
      }
    })
  }

  const toggleAll = (isChecked: boolean) => {
    setSelectedFiles(isChecked && files ? [...files] : [])
  }

  const toggleSingle = (file: string, isChecked: boolean) => {
    setSelectedFiles((prev) =>
      isChecked ? [...prev, file] : prev.filter((f) => f !== file)
    )
  }

  if (files === undefined)
    return (
      <section className="container w-full mx-auto px-4">
        <h1 className="text-xl font-bold py-4">Download History</h1>
        <Card className="p-4 text-center">Loading...</Card>
      </section>
    )

  return (
    <section className="container w-full mx-auto px-4">
      <h1 className="text-xl font-bold pt-8 pb-4">Download History</h1>
      <Card>
        {files.length === 0 ? (
          <div className="text-center p-4">
            <h1 className="font-bold text-xl">No downloads found</h1>
            <p>
              You can make a download by getting a url from a{" "}
              <Link
                href={
                  "https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md"
                }
                className="underline"
              >
                supported website
              </Link>{" "}
              and inserting it above.
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {/* Check All */}
                    <Input
                      type="checkbox"
                      className="w-4"
                      checked={files.length > 0 && selectedFiles.length === files.length}
                      onChange={(e) => toggleAll(e.target.checked)}
                    />
                  </TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className='w-8'>
                        {/* Individual Checkboxes */}
                        <Input
                          type="checkbox"
                          className="w-4"
                          checked={selectedFiles.includes(file)}
                          onChange={(e) => toggleSingle(file, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell className="font-medium break-all">
                        <Link
                          href={`/downloads/${userId}/${file}`}
                          target="_blank"
                        >
                          {file}
                        </Link>
                      </TableCell>
                      <TableCell className="flex gap-4 justify-end items-center m-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex flex-col items-center justify-center">
                            <BsThreeDots size={24} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="flex flex-col gap-1">
                            <Button className="w-full" asChild>
                              <a href={`/downloads/${userId}/${file}`} download={file}>
                                Download
                              </a>
                            </Button>
                            <DeleteDownloadAlert
                              refreshDownloads={fetchFiles}
                              file={file}
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {selectedFiles.length > 0 && (
              <Card className="fixed bottom-4 p-4 flex flex-col gap-4 left-1/2 -translate-x-1/2 z-10">
                <h1 className="text-center font-bold">
                  Selected {selectedFiles.length} files
                </h1>
                <div className="flex gap-4">
                  <Button>Download</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className='w-full' variant={'destructive'}>
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className='break-all'>Are you sure you want to delete {selectedFiles.length} files?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the filesfrom the server.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteFiles}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            )}
          </>
        )}
      </Card>
    </section>
  )
}

export default DownloadHistory