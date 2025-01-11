import Credentials from "next-auth/providers/credentials"
import { Provider } from "next-auth/providers/index"
import { signInSchema } from "./lib/zod"
import { prisma } from "./prisma"
import { compare } from "bcryptjs"
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { v4 } from "uuid"
import { encode } from "next-auth/jwt"

const adapter = PrismaAdapter(prisma)

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    authorize: async (credentials) => {
      const { email, password } = await signInSchema.parseAsync(credentials)

      const user = await prisma.user.findFirst({
        where: { email }
      })
      
      if (!user) return null
      if (!user.passwordHash) return null
      
      const compared = await compare(password, user.passwordHash)

      if (!compared) return null

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      }
    },
  })
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true
      }
      return token
    },
  },
  jwt: {
    encode: async (params) => {
      if (params.token?.credentials) {
        const sessionToken = v4() // uuid for the session token

        if (!params.token.sub) {
          throw new Error("No user ID found in token")
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })

        if (!createdSession) {
          throw new Error("Failed to create session")
        }

        return sessionToken
      }
      return encode(params)
    }
  }
})