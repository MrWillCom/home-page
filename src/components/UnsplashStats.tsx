'use client'

import { useState, useEffect } from 'react'
import NumberFlow from '@number-flow/react'

export default function UnsplashStats({
  initialViews,
  initialDownloads,
  viewsInterval,
  downloadsInterval,
}: {
  initialViews: number
  initialDownloads: number
  viewsInterval: number
  downloadsInterval: number
}) {
  const [viewsOffset, setViewsOffset] = useState(0)
  const [downloadsOffset, setDownloadsOffset] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setViewsOffset(v => v + 1)
    }, viewsInterval)
    return () => clearInterval(id)
  }, [viewsInterval])

  useEffect(() => {
    const id = setInterval(() => {
      setDownloadsOffset(d => d + 1)
    }, downloadsInterval)
    return () => clearInterval(id)
  }, [downloadsInterval])

  return (
    <dl>
      <div>
        <dd>
          <NumberFlow
            value={initialDownloads + downloadsOffset}
            trend={1}
            format={{ useGrouping: false }}
          />
        </dd>
        <dt>Downloads</dt>
      </div>
      <div>
        <dd>
          <NumberFlow
            value={initialViews + viewsOffset}
            trend={1}
            format={{ useGrouping: false }}
          />
        </dd>
        <dt>Views</dt>
      </div>
    </dl>
  )
}
