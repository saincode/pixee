'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, Event, Photo } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSignup, setIsSignup] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const [eventName, setEventName] = useState('')
  const [eventCode, setEventCode] = useState('')
  const [events, setEvents] = useState<Event[]>([])
  const [eventLoading, setEventLoading] = useState(false)

  const [selectedEventId, setSelectedEventId] = useState('')
  const [photoUrls, setPhotoUrls] = useState('')
  const [driveFolderLink, setDriveFolderLink] = useState('')
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [photoLoading, setPhotoLoading] = useState(false)

  useEffect(() => {
    checkUser()
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => { authListener.subscription.unsubscribe() }
  }, [])

  useEffect(() => { if (user) loadEvents() }, [user])
  useEffect(() => {
    if (selectedEventId) loadPhotos(selectedEventId)
    else setPhotos([])
  }, [selectedEventId])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setAuthLoading(true); setAuthError('')
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
    if (error) setAuthError(error.message)
    else alert('Signup successful! Check your email to confirm your account.')
    setAuthLoading(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthLoading(true); setAuthError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setAuthError(error.message)
    setAuthLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setEvents([]); setPhotos([]); setSelectedEventId('')
  }

  async function loadEvents() {
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false })
    if (!error && data) setEvents(data)
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault(); setEventLoading(true)
    const { error } = await supabase.from('events').insert([{ name: eventName, code: eventCode }])
    if (!error) { setEventName(''); setEventCode(''); loadEvents() }
    else alert('Error creating event: ' + error.message)
    setEventLoading(false)
  }

  async function loadPhotos(eventId: string) {
    const { data, error } = await supabase.from('photos').select('*').eq('event_id', eventId).order('created_at', { ascending: false })
    if (!error && data) setPhotos(data)
  }

  async function handleAddPhotos(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedEventId) { alert('Please select an event first'); return }
    setPhotoLoading(true)

    if (photoUrls.trim()) {
      const urls = photoUrls.split('\n').map(u => u.trim()).filter(u => u.length > 0)
      if (urls.length > 0) {
        const { error } = await supabase.from('photos').insert(urls.map(url => ({ event_id: selectedEventId, image_url: url, source_type: 'url' as const })))
        if (error) alert('Error adding URLs: ' + error.message)
      }
    }

    if (driveFolderLink.trim()) {
      const { error } = await supabase.from('photos').insert([{ event_id: selectedEventId, image_url: driveFolderLink, source_type: 'drive_folder' as const }])
      if (error) alert('Error adding Drive folder: ' + error.message)
      else alert('Drive folder link saved!')
    }

    if (uploadFiles && uploadFiles.length > 0) {
      let uploadedCount = 0
      for (let i = 0; i < uploadFiles.length; i++) {
        const file = uploadFiles[i]
        try {
          const fileExt = file.name.split('.').pop()
          const fileName = `${selectedEventId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
          const { error: uploadError } = await supabase.storage.from('event-photos').upload(fileName, file, { cacheControl: '3600', upsert: false })
          if (uploadError) throw uploadError
          const { data: urlData } = supabase.storage.from('event-photos').getPublicUrl(fileName)
          const { error: dbError } = await supabase.from('photos').insert([{ event_id: selectedEventId, image_url: urlData.publicUrl, source_type: 'upload' as const }])
          if (dbError) throw dbError
          uploadedCount++
        } catch (err: any) { alert(`Failed to upload ${file.name}: ${err.message}`) }
      }
      if (uploadedCount > 0) alert(`Successfully uploaded ${uploadedCount} file(s)!`)
    }

    setPhotoUrls(''); setDriveFolderLink(''); setUploadFiles(null)
    loadPhotos(selectedEventId); setPhotoLoading(false)
  }

  async function handleDeletePhoto(photoId: string) {
    if (!confirm('Delete this photo?')) return
    const { error } = await supabase.from('photos').delete().eq('id', photoId)
    if (!error) loadPhotos(selectedEventId)
  }

  /* ── Shared Navbar ── */
  const Navbar = ({ subtitle }: { subtitle?: string }) => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-[#158fa8]">
          Pixee<span className="text-[#0a4f5c]">.</span>
          {subtitle && <span className="ml-2 text-sm font-semibold text-gray-400 tracking-normal">{subtitle}</span>}
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-[#158fa8] transition-colors px-4 py-2">
            ← Home
          </Link>
          {user && (
            <button
              onClick={handleLogout}
              className="text-sm font-semibold border border-[#158fa8] text-[#158fa8] px-5 py-2 rounded-full hover:bg-[#e0f7fa] transition-all duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex items-center gap-3 text-[#158fa8]">
        <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="text-lg font-medium">Loading...</span>
      </div>
    </div>
  )

  /* ── Auth Screen ── */
  if (!user) return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fbfc] via-white to-white">
      <Navbar subtitle="Admin" />
      <div className="pt-32 pb-16 px-6 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-[#0a4f5c] mb-2">
              Admin <span className="text-[#158fa8]">Portal</span>
            </h1>
            <p className="text-gray-500 text-sm">
              {isSignup ? 'Create your organizer account' : 'Sign in to manage your events'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8">
            <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-5">
              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-[#0a4f5c] mb-1.5">Full Name</label>
                  <input
                    type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a4f5c] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#158fa8] focus:border-transparent text-sm transition"
                    placeholder="John Doe" required={isSignup}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[#0a4f5c] mb-1.5">Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a4f5c] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#158fa8] focus:border-transparent text-sm transition"
                  placeholder="admin@example.com" required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0a4f5c] mb-1.5">Password</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a4f5c] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#158fa8] focus:border-transparent text-sm transition"
                  placeholder="••••••••" required
                />
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                  {authError}
                </div>
              )}

              <button
                type="submit" disabled={authLoading}
                className="w-full py-3 bg-[#158fa8] text-white font-semibold rounded-xl hover:bg-[#0e6b7d] disabled:opacity-60 transition-all duration-200 text-sm shadow-md hover:shadow-lg"
              >
                {authLoading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
              </button>

              <div className="text-center">
                <button type="button" onClick={() => { setIsSignup(!isSignup); setAuthError('') }}
                  className="text-sm text-[#158fa8] hover:text-[#0e6b7d] font-medium transition-colors"
                >
                  {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )

  /* ── Dashboard ── */
  return (
    <div className="min-h-screen bg-[#f8fefe]">
      <Navbar subtitle="Admin" />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-[#0a4f5c]">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Logged in as <span className="text-[#158fa8] font-medium">{user.email}</span></p>
          </div>

          {/* Top Row — Create Event + Events List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/* Create Event */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#e0f7fa] rounded-xl flex items-center justify-center text-[#158fa8]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-[#0a4f5c]">Create Event</h2>
              </div>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0a4f5c] mb-1.5">Event Name</label>
                  <input
                    type="text" value={eventName} onChange={e => setEventName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a4f5c] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#158fa8] text-sm transition"
                    placeholder="e.g. Wedding 2024" required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a4f5c] mb-1.5">Event Code <span className="text-gray-400 font-normal">(unique)</span></label>
                  <input
                    type="text" value={eventCode} onChange={e => setEventCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a4f5c] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#158fa8] text-sm font-mono transition"
                    placeholder="WED2024" required
                  />
                </div>
                <button
                  type="submit" disabled={eventLoading}
                  className="w-full py-3 bg-[#158fa8] text-white font-semibold rounded-xl hover:bg-[#0e6b7d] disabled:opacity-60 transition-all duration-200 text-sm shadow-md hover:shadow-lg"
                >
                  {eventLoading ? 'Creating...' : 'Create Event'}
                </button>
              </form>
            </div>

            {/* Events List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#e0f7fa] rounded-xl flex items-center justify-center text-[#158fa8]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-[#0a4f5c]">Events <span className="text-gray-400 font-normal text-sm">({events.length})</span></h2>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {events.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">No events yet. Create one!</div>
                ) : events.map(event => (
                  <div key={event.id} className="flex items-center justify-between px-4 py-3 bg-[#f8fefe] rounded-xl border border-gray-100 hover:border-[#b2ebf2] transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-[#0a4f5c]">{event.name}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{event.code}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-[#e0f7fa] text-[#158fa8] px-2 py-1 rounded-full">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Photo Management */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#e0f7fa] rounded-xl flex items-center justify-center text-[#158fa8]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[#0a4f5c]">Manage Photos</h2>
            </div>

            {/* Event Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#0a4f5c] mb-1.5">Select Event</label>
              <select
                value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a4f5c] focus:outline-none focus:ring-2 focus:ring-[#158fa8] text-sm bg-white transition"
              >
                <option value="">-- Choose an event --</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.name} ({event.code})</option>
                ))}
              </select>
            </div>

            {selectedEventId && (
              <>
                {/* Add Photos Form */}
                <form onSubmit={handleAddPhotos} className="space-y-5 mb-8 pb-8 border-b border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0a4f5c] mb-1.5">
                        <span className="mr-1">📎</span> Photo URLs <span className="text-gray-400 font-normal">(one per line)</span>
                      </label>
                      <textarea
                        value={photoUrls} onChange={e => setPhotoUrls(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a4f5c] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#158fa8] font-mono text-xs transition resize-none"
                        placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"}
                        rows={4}
                      />
                    </div>
                    <div>
                      <div className="mb-5">
                        <label className="block text-sm font-medium text-[#0a4f5c] mb-1.5">
                          <span className="mr-1">📁</span> Google Drive Folder
                        </label>
                        <input
                          type="url" value={driveFolderLink} onChange={e => setDriveFolderLink(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0a4f5c] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#158fa8] text-sm transition"
                          placeholder="https://drive.google.com/drive/folders/..."
                        />
                        <p className="text-xs text-gray-400 mt-1">Make sure the folder is set to public</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0a4f5c] mb-1.5">
                          <span className="mr-1">💾</span> Upload Files Directly
                        </label>
                        <input
                          type="file" accept="image/*" multiple onChange={e => setUploadFiles(e.target.files)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[#0a4f5c] text-sm bg-white file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#158fa8] file:text-white hover:file:bg-[#0e6b7d] transition"
                        />
                        <p className="text-xs text-gray-400 mt-1">Uploads to Supabase Storage</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={photoLoading || (!photoUrls.trim() && !driveFolderLink.trim() && (!uploadFiles || uploadFiles.length === 0))}
                    className="px-8 py-3 bg-[#158fa8] text-white font-semibold rounded-xl hover:bg-[#0e6b7d] disabled:opacity-50 transition-all duration-200 text-sm shadow-md hover:shadow-lg"
                  >
                    {photoLoading ? 'Uploading...' : 'Add Photos'}
                  </button>
                </form>

                {/* Photos Grid */}
                <div>
                  <h3 className="text-base font-bold text-[#0a4f5c] mb-4">
                    Current Photos <span className="text-gray-400 font-normal">({photos.length})</span>
                  </h3>
                  {photos.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl">
                      No photos yet for this event
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {photos.map(photo => (
                        <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                          {photo.source_type === 'drive_folder' ? (
                            <div className="w-full h-36 flex items-center justify-center bg-[#f0fbfc]">
                              <div className="text-center p-3">
                                <p className="text-2xl mb-1">📁</p>
                                <p className="text-[#0a4f5c] text-xs font-medium">Drive Folder</p>
                                <p className="text-gray-400 text-[10px] mt-1 truncate max-w-[100px]">{photo.image_url}</p>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={photo.image_url} alt="Event photo"
                              className="w-full h-36 object-cover"
                              onError={e => { e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Error' }}
                            />
                          )}
                          <button
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
