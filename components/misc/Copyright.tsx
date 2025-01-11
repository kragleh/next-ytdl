import React from 'react'

const Copyright = () => {
  return (
    <>
      { new Date().getFullYear() === 2025 ? (2025) : ('2025 • ' + new Date().getFullYear()) } © Next YTDL by <span> </span>
      <a href="https://kragleh.com" className="underline underline-offset-4">
        kragleh.com
      </a>
    </>
  )
}

export default Copyright