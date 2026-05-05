'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, Event } from '@/lib/supabase'
import * as faceapi from 'face-api.js'
import {
  loadModels,
  detectFaceDescriptor,
  fileToImage,
  loadImage,
  euclideanDistance,
  MatchResult,
} from '@/lib/faceDetection'

export default function FindPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState('')
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [selfiePreview, setSelfiePreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [progress, setProgress] = useState('')
  const [progressPercent, setProgressPercent] = useState(0)
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const MATCH_THRESHOLD = 0.65

  useEffect(() => {
    loadEvents()
    initializeModels()
  }, [])

  async function loadEvents() {
    const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false })
    if (data) setEvents(data)
  }

  async function initializeModels() {
    try {
      setProgress('Loading AI models...')
      await loadModels()
      setModelsLoaded(true)
      setProgress('')
    } catch (err) {
      setError('Failed to load face detection models')
    }
  }

  function handleSelfieChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelfieFile(file)
      setSelfiePreview(URL.createObjectURL(file))
      setMatches([])
      setError('')
      setSearched(false)
    }
  }

  async function handleFindPhotos() {
    if (!selectedEventId || !selfieFile) {
      setError('Please select an event and upload a selfie')
      return
    }
    setLoading(true); setError(''); setMatches([]); setSearched(false); setProgressPercent(0)

    try {
      setProgress('Analyzing your selfie...')
      const selfieImage = await fileToImage(selfieFile)
      const selfieDescriptor = await detectFaceDescriptor(selfieImage)

      if (!selfieDescriptor) {
        setError('No face detected in your selfie. Please try a clearer photo.')
        setLoading(false); return
      }

      setProgress('Loading event photos...')
      const { data: photos } = await supabase.from('photos').select('*').eq('event_id', selectedEventId)

      if (!photos || photos.length === 0) {
        setError('No photos found for this event')
        setLoading(false); return
      }

      const matchedPhotos: MatchResult[] = []
      const total = photos.length

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]
        setProgress(`Scanning photo ${i + 1} of ${total}...`)
        setProgressPercent(Math.round(((i + 1) / total) * 100))

        try {
          const eventImage = await loadImage(photo.image_url)
          const detections = await faceapi
            .detectAllFaces(eventImage, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors()

          if (detections && detections.length > 0) {
            for (const detection of detections) {
              const distance = euclideanDistance(selfieDescriptor, detection.descriptor)
              if (distance < MATCH_THRESHOLD) {
                matchedPhotos.push({
                  imageUrl: photo.image_url,
                  distance,
                  confidence: Math.max(0, 100 - distance * 100),
                })
                break
              }
            }
          }
        } catch (err) {
          console.error(`Error processing photo ${photo.id}:`, err)
        }
      }

      matchedPhotos.sort((a, b) => a.distance - b.distance)
      setMatches(matchedPhotos)
      setSearched(true)
      setProgress(matchedPhotos.length > 0
        ? `Found ${matchedPhotos.length} photo(s) with your face!`
        : 'No matching photos found. Try a clearer selfie.')
    } catch (err) {
      setError('An error occurred while processing photos')
    }

    setProgressPercent(100)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f8fefe] font-sans">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-[#158fa8]">
            Pixee<span className="text-[#0a4f5c]">.</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-[#158fa8] transition-colors px-4 py-2">
              ← Home
            </Link>
            <Link href="/admin" className="text-sm font-semibold border border-[#158fa8] text-[#158fa8] px-5 py-2 rounded-full hover:bg-[#e0f7fa] transition-all duration-200">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">

          {/* ── Page Header ── */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-[#0a4f5c] mb-2">Find Your Photos</h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Upload a selfie, pick your event, and let Pixee find every photo of you instantly.
            </p>
            {/* Model status pill */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold
              transition-colors
              ${modelsLoaded
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'}">
              <span className={`w-2 h-2 rounded-full ${modelsLoaded ? 'bg-green-500' : 'bg-amber-400 animate-pulse'}`} />
              {modelsLoaded ? 'AI models ready — on-device, 100% private' : 'Loading AI models...'}
            </div>
          </div>

          {/* ── Main Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">

            {/* Left — Controls (3 cols) */}
            <div className="lg:col-span-3 space-y-5">

              {/* Step 1 — Select Event */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#158fa8] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <h2 className="text-base font-bold text-[#0a4f5c]">Select Your Event</h2>
                </div>
                <select
                  value={selectedEventId}
                  onChange={e => setSelectedEventId(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a4f5c] bg-white focus:outline-none focus:ring-2 focus:ring-[#158fa8] text-sm transition disabled:opacity-60"
                >
                  <option value="">-- Choose an event --</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.name} ({event.code})</option>
                  ))}
                </select>
              </div>

              {/* Step 2 — Upload Selfie */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#158fa8] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <h2 className="text-base font-bold text-[#0a4f5c]">Upload Your Selfie</h2>
                </div>

                <input
                  type="file" accept="image/*"
                  onChange={handleSelfieChange}
                  className="hidden" id="selfie-input" disabled={loading}
                />

                {selfiePreview ? (
                  <div className="relative">
                    <img
                      src={selfiePreview} alt="Selfie preview"
                      className="w-full h-52 object-cover rounded-xl border border-gray-100"
                    />
                    <label
                      htmlFor="selfie-input"
                      className="absolute bottom-3 right-3 cursor-pointer text-xs font-semibold bg-white/90 text-[#158fa8] border border-[#158fa8] px-3 py-1.5 rounded-full hover:bg-[#e0f7fa] transition shadow"
                    >
                      Change
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="selfie-input"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#b2ebf2] rounded-xl cursor-pointer hover:bg-[#f0fbfc] transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#e0f7fa] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-[#158fa8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-[#158fa8]">Click to upload selfie</span>
                    <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP supported</span>
                  </label>
                )}
              </div>

              {/* Step 3 — Find Button */}
              <button
                onClick={handleFindPhotos}
                disabled={!selectedEventId || !selfieFile || loading || !modelsLoaded}
                id="find-photos-btn"
                className="w-full py-4 bg-[#158fa8] text-white font-bold rounded-2xl text-base hover:bg-[#0e6b7d] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Find My Photos
                  </>
                )}
              </button>
            </div>

            {/* Right — How It Works (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-[#0a4f5c] mb-5">How It Works</h2>
              <div className="space-y-5">
                {[
                {
                  icon: (
                    <svg className="w-5 h-5 text-[#158fa8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                  title: 'Upload Your Selfie',
                  desc: 'A clear front-facing photo works best.',
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-[#158fa8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                  title: 'On-Device AI',
                  desc: 'Face matching runs entirely in your browser — nothing is uploaded.',
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-[#158fa8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ),
                  title: 'Instant Results',
                  desc: 'We scan all event photos and show only the ones with your face.',
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-[#158fa8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                  title: '100% Private',
                  desc: 'Your face data never leaves your device.',
                },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#e0f7fa] rounded-xl flex items-center justify-center text-base flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0a4f5c]">{item.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Progress Bar ── */}
          {loading && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[#0a4f5c]">{progress}</p>
                <span className="text-xs font-bold text-[#158fa8]">{progressPercent}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#158fa8] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* ── Status Message (non-loading) ── */}
          {!loading && progress && (
            <div className={`rounded-2xl border p-4 mb-6 flex items-center gap-3 ${
              matches.length > 0
                ? 'bg-green-50 border-green-200'
                : searched ? 'bg-amber-50 border-amber-200' : 'bg-[#e0f7fa] border-[#b2ebf2]'
            }`}>
              <span className="text-xl">{matches.length > 0 ? '🎉' : searched ? '🔍' : 'ℹ️'}</span>
              <p className={`text-sm font-medium ${
                matches.length > 0 ? 'text-green-700' : searched ? 'text-amber-700' : 'text-[#0a4f5c]'
              }`}>{progress}</p>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}

          {/* ── Results ── */}
          {matches.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0a4f5c]">
                    {matches.length} {matches.length === 1 ? 'Photo' : 'Photos'} Found!
                  </h2>
                  <p className="text-gray-400 text-sm mt-0.5">Sorted by best match. Right-click any photo to save it.</p>
                </div>
                <span className="text-xs font-bold bg-[#e0f7fa] text-[#158fa8] px-3 py-1.5 rounded-full border border-[#b2ebf2]">
                  {matches.length} match{matches.length !== 1 ? 'es' : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="relative group overflow-hidden rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    <img
                      src={match.imageUrl} alt={`Match ${index + 1}`}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-3 w-full">
                        <span className="text-xs font-bold text-white bg-[#158fa8] px-2 py-1 rounded-full">
                          {match.confidence.toFixed(0)}% match
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-2 text-gray-400 text-xs">
                <svg className="w-4 h-4 text-[#158fa8]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Tip: Right-click any photo and select &quot;Save image as&quot; to download it.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
