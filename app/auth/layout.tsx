import { auth } from '@/auth'
import { ThemeToggle } from '@/components/misc/ThemeToggle'
import { prisma } from '@/prisma'
import { redirect } from 'next/navigation'
import React from 'react'

const SignInLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  if (session) redirect('/')

  if (await prisma.user.findFirst() === null) {
    redirect('/setup')
  }
  
  return (
    <main className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className="w-full max-w-sm">
        { children }
      </div>
      <div className='absolute bottom-4 left-4 z-10'>
        <ThemeToggle />
      </div>
    </main>
  )
}

export default SignInLayout