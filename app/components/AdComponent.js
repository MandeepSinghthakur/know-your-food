// File: components/AdComponent.js
'use client'

import { useEffect } from 'react'

export default function AdComponent({ slot }) {
  useEffect(() => {
    // Load Google AdSense script
    const script = document.createElement('script')
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6061696000364436"'
    script.async = true
    script.crossOrigin = 'anonymous'
    document.body.appendChild(script)

    // Initialize ads
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className="ad-container my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="YOUR_ADSENSE_CLIENT_ID"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}