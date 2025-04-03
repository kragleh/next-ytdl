import { auth } from "@/auth"
import { downloadDeleteSchema } from "@/lib/zod"
import { prisma } from "@/prisma"

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user || !session.user.id) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 })

  const body = await request.json()
  const { file } = await downloadDeleteSchema.parseAsync(body)

  const id = await prisma.downloadQueue.findFirst({
    where: {
      userId: session.user.id,
      file: file
    }
  })

  await prisma.downloadQueue.delete({
    where: {
      id: id?.id
    }
  })
  
  return Response.json({ status: 'success' })
}