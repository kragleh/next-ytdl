import { auth } from "@/auth"
import { downloadDeleteSchema } from "@/lib/zod"
import { unlinkSync } from "fs"
import path from "path"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 })

  const body = await request.json()
  const { file } = await downloadDeleteSchema.parseAsync(body)

  unlinkSync(`${process.cwd()}${path.sep}public${path.sep}downloads${path.sep}${session.user?.id}${path.sep}${file}`)

  return Response.json({ status: 'success' })
}