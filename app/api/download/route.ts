import { auth } from "@/auth"
import { downloadSchema } from "@/lib/zod"
import { prisma } from "@/prisma"
import path from "path"
import process from "process"
import YTDlpWrap from "yt-dlp-wrap"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 })

  try {
    const body = await request.json()
    const { url, format, quality } = await downloadSchema.parseAsync(body)
    const ytDlpWrap = new YTDlpWrap()

    let args = []
    let fileName = ''

    if (format === 'mp3') {
      args = [
        '--extract-audio',
        '--audio-format',
        'mp3',
        '--audio-quality',
        quality,
        '-o',
        `${process.cwd()}${path.sep}public${path.sep}downloads${path.sep}${session.user?.id}${path.sep}${"%(title)s_" + quality + ".%(ext)s"}`,
        '--restrict-filenames',
        url,
      ]

      try {
        const printArgs = ["--print", "%(title)s_" + quality + ".%(ext)s", url]
        const output = await ytDlpWrap.execPromise(printArgs)
        fileName = output.trim()
      } catch (error) {
        console.error("Error fetching filename:", error)
        return new Response(JSON.stringify({ message: "Failed to fetch filename" }), { status: 500 })
      }
    } else {
      args = [
        '-f',
        `bestvideo[height<=${quality}]+bestaudio`,
        '--merge-output-format',
        'mp4',
        '-o',
        `${process.cwd()}${path.sep}public${path.sep}downloads${path.sep}${session.user?.id}${path.sep}${"%(title)s_" + quality + "p.%(ext)s"}`,
        '--restrict-filenames',
        url,
      ]

      try {
        const printArgs = ["--print", "%(title)s_" + quality + "p.%(ext)s", url]
        const output = await ytDlpWrap.execPromise(printArgs)
        fileName = output.trim()
      } catch (error) {
        console.error("Error fetching filename:", error)
        return new Response(JSON.stringify({ message: "Failed to fetch filename" }), { status: 500 })
      }
    }

    if (!fileName) return new Response(JSON.stringify({ message: "Failed to fetch filename" }), { status: 500 })
    if (!session.user || !session.user.id) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 })

    if (fileName.includes('.webm')) {
      const count = fileName.split('.webm').length - 1
      if (count !== 1) { 
        fileName = `Playlist of ${count} videos`
      }
    }

    const download = await prisma.downloadQueue.create({
      data: {
        file: fileName,
        userId: session.user.id,
        status: 'in-progress',
      },
    })

    ytDlpWrap.exec(args).on('progress', async (progress) => {
      await prisma.downloadQueue.update({
        where: { id: download.id },
        data: { progress: progress.percent, status: 'in-progress' },
      })
    }).on('ytDlpEvent', (eventType, eventData) =>
      console.log('YT Event:', eventType, eventData)
    ).on('error', async (error) => {
      console.error(error)
      await prisma.downloadQueue.update({
        where: { id: download.id },
        data: { status: 'error' },
      })
    }).on('close', async () => {
      console.log('Download done')
      await prisma.downloadQueue.delete({
        where: { id: download.id },
      })
    })

    return Response.json({ status: 'in-progress' })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ message: "Something went wrong" }), { status: 500 })
  }
  
}