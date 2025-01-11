import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Header from '@/components/nav/Header'
import { ThemeToggle } from '@/components/misc/ThemeToggle'
import DownloadForm from '@/components/form/download/DownloadForm'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import SignOutDropdownItem from '@/components/auth/SignOutDropdownItem'
import DownloadHistory from '@/components/downloads/DownloadHistory'

const HomePage = async () => {
  const session = await auth()
  if (!session) redirect('/auth/signin')

  const user = session.user

  return (
    <>
      <Header className='flex items-center justify-between'> 
        <h1 className='text-xl font-bold'>Next YTDL</h1>
        <DropdownMenu>
          <DropdownMenuTrigger>
            { user?.name || 'username' }
          </DropdownMenuTrigger>
          <DropdownMenuContent className='mx-4 my-2'>
            <SignOutDropdownItem />
          </DropdownMenuContent>
        </DropdownMenu>
      </Header>

      <DownloadForm />

      <DownloadHistory />

      <div className='absolute bottom-4 left-4 z-10'>
        <ThemeToggle />
      </div>
    </>
  )
}

export default HomePage