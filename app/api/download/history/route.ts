import { auth } from "@/auth"
import { readdirSync } from "fs"
import path from "path"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 })

  const files = readdirSync(`${process.cwd()}${path.sep}public${path.sep}downloads${path.sep}${session?.user?.id}`)

  const filteredFiles = files.filter(file => /\.(mp4|mp3)$/i.test(file))

  return Response.json({ files: filteredFiles })
}