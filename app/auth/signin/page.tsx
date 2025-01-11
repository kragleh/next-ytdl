"use client"
import React from 'react'
import { signIn } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Copyright from '@/components/misc/Copyright'
 
const SignInPage = () => {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const res = await signIn('credentials', { redirect: false, email, password })
    console.log(res)
    if ( res?.error ) {
      console.log(`Error: ${res}`);
    } else {
      redirect('/')
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-2xl'>Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-6'>
          <div className='grid gap-2'>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="username@example.com"
              onChange={(e) => {setEmail(e.target.value)}}
              required
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              onChange={(e) => {setPassword(e.target.value)}}
              required
            />
          </div>
          <Button onClick={handleSubmit} type="submit" className="w-full">
            Sign In
          </Button>
          <div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/auth/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
            <div className="text-center text-sm mt-2">
              <Copyright />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignInPage