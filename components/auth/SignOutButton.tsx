"use client"
import { signOut } from 'next-auth/react'
import React from 'react'
import { Button } from '../ui/button'

const SignOutButton = () => {
  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <Button onClick={handleSignOut} variant={'destructive'}>
      Sign Out
    </Button>
  )
}

export default SignOutButton