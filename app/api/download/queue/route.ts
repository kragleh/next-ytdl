import { auth } from "@/auth"
import { prisma } from "@/prisma"

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user || !session.user.id) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 })

  const downloadQueue = await prisma.downloadQueue.findMany({
    where: {
      userId: session.user.id
    }
  })

  return Response.json({ downloadQueue })
}