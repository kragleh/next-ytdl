"use client"
import Copyright from '@/components/misc/Copyright'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { signUpSchema } from '@/lib/zod'
import React from 'react'
import { ZodError } from 'zod'

const SetupForm = () => {
  const toast = useToast()
  const [email, setEmail] = React.useState("")
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [passwordConfirm, setPasswordConfirm] = React.useState("")

  const handleSubmit = async () => {
    if (password !== passwordConfirm) {
      toast.toast({
        title: "Passwords do not match",
      })
      return
    }

    try {
      const valid = signUpSchema.parse({ email, username, password })

      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: valid.email,
            username: valid.username,
            password: valid.password,
          }),
        })

        if (res.status === 200) {
          window.location.href = "/auth/signin"
        } else {
          const data = await res.json()
          toast.toast({
            title: "Something went wrong",
            description: "More info in console",
            variant: "destructive",
          })
  
          console.log(data)
        }
      } catch (error) {
        toast.toast({
          title: "Something went wrong",
          description: "More info in console",
          variant: "destructive",
        })

        console.log(error)
      }
    } catch (error) {
      if (error instanceof ZodError) {
        toast.toast({
          title: error.errors[0].message,
        })
      } else {
        toast.toast({
          title: "Something went wrong",
          description: "More info in console",
          variant: "destructive",
        })

        console.log(error)
      }
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-2xl'>Setup</CardTitle>
          <CardDescription>
            Create the first user of this application
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-6'>
          <div className='grid gap-2'>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="username"
              onChange={(e) => {setUsername(e.target.value)}}
              required
            />
          </div>
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
              placeholder='********'
              onChange={(e) => {setPassword(e.target.value)}}
              required
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor="password">Confirm Password</Label>
            <Input
              id="passwordConfirm"
              type="password"
              placeholder='********'
              onChange={(e) => {setPasswordConfirm(e.target.value)}}
              required
            />
          </div>
          <Button onClick={handleSubmit} type="submit" className="w-full">
            Sign Up
          </Button>
          <div>
            {/* <div className="text-center text-sm">
              Need help?{" "}
              <a href="https://example.com" className="underline underline-offset-4">
                GitHub
              </a>
            </div> */}
            <div className="text-center text-sm mt-2">
              <Copyright />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SetupForm