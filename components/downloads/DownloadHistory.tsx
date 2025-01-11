import { auth } from '@/auth'
import { readdirSync } from 'fs'
import path from 'path'
import React from 'react'

const DownloadHistory = async () => {
  const session = await auth()

  const files = readdirSync(`${process.cwd()}${path.sep}public${path.sep}downloads${path.sep}${session?.user?.id}`)

  return (
    <section className='container w-full mx-auto px-4'>
      <h1 className='text-xl font-bold'>Download History</h1>
      {
        files.map((file, index) => {
          return (
            <div key={index} className='flex items-center gap-2'>
              { file }
            </div>
          )
        })
      }
    </section>
  )
}

export default DownloadHistory