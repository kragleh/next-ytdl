import { auth } from "@/auth"
import { downloadSchema } from "@/lib/zod"
import { prisma } from "@/prisma"
import path from "path"
import process from "process"
import YTDlpWrap from 'yt-dlp-wrap'

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 })

  const body = await request.json()
  const { url, format, quality } = await downloadSchema.parseAsync(body)

  const ytDlpWrap = new YTDlpWrap()

  let args = []

  if (format === 'mp3') {
    let bitrate = '320K'
    if (quality !== 'best') {
      if (quality === '320kbps') {
        bitrate = '320K'
      } else if (quality === '192kbps') {
        bitrate = '192K'
      } else if (quality === '128kbps') {
        bitrate = '128K'
      }
    }

    args = [
      '--extract-audio',
      '--audio-format',
      'mp3',
      '--audio-quality',
      bitrate,
      '-o',
      `${process.cwd()}${path.sep}public${path.sep}downloads${path.sep}${session.user?.id}${path.sep}${"%(title)s_" + quality + ".%(ext)s"}`,
      '--restrict-filenames',
      url,
    ]
  } else {
    let res = '2160'
    if (quality !== 'best') {
      if (quality === '2160p') {
        res = '2160'
      } else if (quality === '1440p') {
        res = '1440'
      } else if (quality === '1080p') {
        res = '1080'
      } else if (quality === '720p') {
        res = '720'
      } else if (quality === '480p') {
        res = '480'
      }
    }

    args = [
      '-f',
      `bestvideo[height<=${res}]+bestaudio`,
      '--merge-output-format',
      'mp4',
      '-o',
      `${process.cwd()}${path.sep}public${path.sep}downloads${path.sep}${session.user?.id}${path.sep}${"%(title)s_" + res + "p.%(ext)s"}`,
      '--restrict-filenames',
      url,
    ]
  }

  // const queueId = await prisma.downloadQueue.create({
  //   data: {
  //     file: url,
  //   }
  // })

  const eventEmitter = ytDlpWrap.exec(args).on('progress', (progress) => {
    console.log(
        progress.percent,
        progress.totalSize,
        progress.currentSpeed,
        progress.eta
    )
  }).on('ytDlpEvent', (eventType, eventData) =>
      console.log(eventType, eventData)
  )
  .on('error', (error) => console.error(error))
  .on('close', () => console.log('all done'))

  return Response.json({ id: 'test' })
}