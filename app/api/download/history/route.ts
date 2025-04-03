import { auth } from "@/auth"
import { readdirSync, statSync } from "fs"
import path from "path"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 })

  const dir = `${process.cwd()}${path.sep}public${path.sep}downloads${path.sep}${session?.user?.id}`
  const files = readdirSync(dir)

  const filteredFiles = files
    .filter(file => /\.(mp4|mp3)$/i.test(file))
    .map(file => ({
      name: file,
      time: statSync(path.join(dir, file)).ctime.getTime()
    }))
    .sort((a, b) => b.time - a.time) // Sort from newest to oldest
    .map(file => file.name);

  return Response.json({ files: filteredFiles })
}