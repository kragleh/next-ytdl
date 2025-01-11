import { cn } from '@/lib/utils'
import React from 'react'

const Header = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <section className={cn('w-full border-b p-4', className)}>
      { children }
    </section>
  )
}

export default Header