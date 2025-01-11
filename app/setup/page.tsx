import SetupForm from '@/components/form/setup/SetupForm'
import { ThemeToggle } from '@/components/misc/ThemeToggle'
import { prisma } from '@/prisma'
import { redirect } from 'next/navigation'
import React from 'react'

const SetupPage = async () => {
  if (await prisma.user.findFirst() !== null) {
    redirect('/auth/signin')
  }

  return (
    <main className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className="w-full max-w-sm">
        <SetupForm />
      </div>
      <div className='absolute bottom-4 left-4 z-10'>
        <ThemeToggle />
      </div>
    </main>
  )
}

export default SetupPage