"use client"
import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { useToast } from '@/hooks/use-toast'

const DeleteDownloadAlert = ({ file, refreshDownloads }: { file: string, refreshDownloads: () => void }) => {
  const toast = useToast()
  const handleDelete = () => {
    fetch('/api/download/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        file
      })
    })
    .then(response => {console.log(response); response.json()})
    .then(data => {
      toast.toast({
        title: 'Download deleted',
        description: 'File is no longer available',
      })

      refreshDownloads()
    }).catch(error => {
      toast.toast({
        title: 'Something went wrong',
        description: 'More info in console',
        variant: 'destructive'
      })

      console.log(error)
    })
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='w-full' variant={'destructive'}>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='break-all'>Are you sure you want to delete {file}</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the file from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteDownloadAlert