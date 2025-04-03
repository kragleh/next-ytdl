import { auth } from "@/auth"
import { downloadPlaylistSchema } from "@/lib/zod"
import YTDlpWrap from 'yt-dlp-wrap'
import { ZodError } from "zod"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 })

  try {
    const body = await request.json()
    const { url } = await downloadPlaylistSchema.parseAsync(body)
    const ytDlpWrap = new YTDlpWrap()
    let videos: Array<{ url: string; title: string }> = []

    if (url.includes("list=")) {
      try {
        const printArgs = ["--flat-playlist", "--dump-json", url]
        const output = await ytDlpWrap.execPromise(printArgs)
        const videoObjects = output.trim().split(/\r?\n/).map(line => JSON.parse(line))
        videoObjects.map(video => {
          videos.push({ url: video.url, title: video.title })
        })
      } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to parse videos" }), { status: 500 })
      }
    } else {
      return new Response(JSON.stringify({ message: "Not a playlist URL" }), { status: 500 })
    }

    return new Response(JSON.stringify({ videos }), { status: 200 })
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ message: error.errors[0].message }), { status: 400 })
    } else {
      return new Response(JSON.stringify({ message: "Something went wrong" }), { status: 500 })
    }
  }
}