"use client"
import { signOut } from 'next-auth/react'
import React from 'react'
import { DropdownMenuItem } from '../ui/dropdown-menu'

const SignOutDropdownItem = () => {
  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <DropdownMenuItem onClick={handleSignOut}>
      Sign Out
    </DropdownMenuItem>
  )
}

export default SignOutDropdownItem