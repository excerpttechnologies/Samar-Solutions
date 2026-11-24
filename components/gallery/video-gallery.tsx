'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Play } from 'lucide-react'
import { galleryVideos, type GalleryVideo } from '@/lib/videos'

function VideoCard({ video }: { video: GalleryVideo }) {
  const [playing, setPlaying] = useState(false)

  return (
    <article className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)]">
      <div
        className={
          video.orientation === 'landscape' ? 'w-full' : 'mx-auto w-full max-w-[22rem]'
        }
      >
        {playing ? (
          <video
            className="h-auto w-full rounded-[1.25rem] bg-black"
            src={video.src}
            poster={video.poster}
            width={video.width}
            height={video.height}
            controls
            autoPlay
            playsInline
            preload="metadata"
            aria-label={video.title}
          >
            Your browser does not support the video element.
          </video>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group relative block w-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/40"
            aria-label={`Play video: ${video.title}`}
          >
            <Image
              src={video.poster}
              alt=""
              width={video.width}
              height={video.height}
              className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#061e3a]/70 via-transparent to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex size-16 items-center justify-center rounded-full bg-[#f39a32] text-[#243447] shadow-xl transition-transform duration-300 group-hover:scale-110">
                <Play aria-hidden="true" className="ml-0.5 size-6 fill-current" />
              </span>
            </span>
          </button>
        )}
      </div>
      <div>
        <h3 className="text-lg font-bold leading-snug text-white">{video.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/65">{video.caption}</p>
      </div>
    </article>
  )
}

export function VideoGallery() {
  return (
    <ul className="mt-10 grid gap-5 sm:grid-cols-2">
      {galleryVideos.map((video) => (
        <li key={video.id}>
          <VideoCard video={video} />
        </li>
      ))}
    </ul>
  )
}
