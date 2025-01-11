import { auth } from "@/auth"
import { exec } from "child_process"
import process from "process"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 })

  

  const body = await request.json()
  const url = body.url
  const format = body.format
  const quality = body.quality

  const cmd: string = `yt-dlp -o ${process.cwd()}\\public\\downloads\\output.mp4 ${url}`

  const executed = exec(cmd)

  executed.stdout?.on("data", (data) => {
    console.log(`stdout: ${data}`)

    const match = data.match(/\[download\]\s+(\d+\.\d+)%/)
    if (match) {
      const progress = parseFloat(match[1])
      console.log('downloading: ', progress, ' id: ' + url)
      //db.set(downloadId, { status: "downloading", progress })
    }
  })

  executed.stderr?.on("data", (data) => {
    console.error(`stderr: ${data}`, ' id: ' + url)
  })

  executed.on("close", (code) => {
    if (code === 0) {
      console.log('downloading: ', 100, ' id: ' + url)
    } else {
      console.log('error: ', 0, ' id: ' + url)
    }
  })

  return Response.json({ id: 'test' })
}