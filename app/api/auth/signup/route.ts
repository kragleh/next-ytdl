import { signUpSchema } from "@/lib/zod"
import { prisma } from "@/prisma"
import { hash } from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password } = await signUpSchema.parseAsync(body)

    if (await prisma.user.findFirst({ where: { email } })) {
      return new Response(JSON.stringify({ message: "Email already in use" }), { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        passwordHash: await hash(password, 10),
      }
    })

    return new Response(JSON.stringify({ userId: user.id }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ message: error }), { status: 400 })
  }
}
