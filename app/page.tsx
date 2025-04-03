import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Header from '@/components/nav/Header'
import { ThemeToggle } from '@/components/misc/ThemeToggle'
import DownloadForm from '@/components/form/download/DownloadForm'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import SignOutDropdownItem from '@/components/auth/SignOutDropdownItem'
import DownloadHistory from '@/components/downloads/DownloadHistory'
import Footer from '@/components/misc/Footer'
import DownloadQueue from '@/components/downloads/DownloadQueue'

const HomePage = async () => {
  const session = await auth()
  if (!session || !session.user || !session.user.id) redirect('/auth/signin')

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

      <DownloadQueue />

      <DownloadHistory userId={session.user.id} />

      <Footer />

      <div className='fixed bottom-4 left-4 z-10'>
        <ThemeToggle />
      </div>
    </>
  )
}

export default HomePage