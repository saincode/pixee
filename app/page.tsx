import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-2xl font-extrabold tracking-tight text-[#158fa8]">
            Pixee<span className="text-[#0a4f5c]">.</span>
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-[#158fa8] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#158fa8] transition-colors">How It Works</a>
            <a href="#stats" className="hover:text-[#158fa8] transition-colors">Stats</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden sm:block text-sm font-medium text-[#0a4f5c] hover:text-[#158fa8] transition-colors px-4 py-2"
            >
              Admin
            </Link>
            <Link
              href="/find"
              className="text-sm font-semibold bg-[#158fa8] text-white px-5 py-2.5 rounded-full hover:bg-[#0e6b7d] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-36 pb-24 px-6 text-center bg-gradient-to-b from-[#f0fbfc] via-white to-white relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#b2ebf2]/30 rounded-full blur-3xl -z-10" />
        <div className="absolute top-20 right-1/4 w-56 h-56 bg-[#e0f7fa]/40 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto">

          <h1 className="text-6xl md:text-7xl font-extrabold text-[#0a4f5c] mb-6 leading-tight tracking-tight">
            Find yourself in<br />
            <span className="text-[#158fa8]">every photo.</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload a selfie and let Pixee scan your event gallery instantly.
            On-device AI means your face data never leaves your phone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/find"
              id="hero-cta-primary"
              className="group flex items-center gap-2 bg-[#158fa8] text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-[#0e6b7d] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto justify-center"
            >
              Find My Photos Free
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/admin"
              id="hero-cta-secondary"
              className="flex items-center gap-2 border-2 border-[#158fa8] text-[#0a4f5c] px-8 py-4 rounded-full font-semibold text-base hover:bg-[#e0f7fa] transition-all duration-300 w-full sm:w-auto justify-center"
            >
              Admin Panel
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 justify-center mt-12 text-sm text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#158fa8]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No account required
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#158fa8]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% private
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#158fa8]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Results in seconds
            </span>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section id="stats" className="py-12 bg-[#158fa8]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: '500+', label: 'Photos scanned' },
            { value: '99%', label: 'Accuracy rate' },
            { value: '<3s', label: 'Avg. search time' },
            { value: '0', label: 'Data stored' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-extrabold mb-1">{s.value}</div>
              <div className="text-sm text-[#b2ebf2] font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#158fa8] mb-3 block">Simple Process</span>
          <h2 className="text-4xl font-extrabold text-[#0a4f5c]">How Pixee works</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Three steps is all it takes to find every photo of you from any event.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* connector line (desktop only) */}
          <div className="hidden md:block absolute top-14 left-1/3 right-1/3 h-0.5 bg-[#b2ebf2]" />

          {[
            {
              step: '01',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
              title: 'Upload your selfie',
              desc: 'Take or upload a clear photo of your face. No account needed.',
            },
            {
              step: '02',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
              title: 'AI scans the gallery',
              desc: 'On-device face recognition runs through hundreds of event photos instantly.',
            },
            {
              step: '03',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              ),
              title: 'Download your photos',
              desc: 'View and download every matched photo in one click. Private, fast, done.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#e0f7fa] text-[#158fa8] rounded-2xl mb-5 mx-auto">
                {item.icon}
              </div>
              <span className="absolute top-4 right-5 text-xs font-bold text-[#b2ebf2]">{item.step}</span>
              <h3 className="text-lg font-bold text-[#0a4f5c] mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 bg-[#f8fefe]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#158fa8] mb-3 block">Why Pixee</span>
            <h2 className="text-4xl font-extrabold text-[#0a4f5c]">Everything you need, nothing you don&apos;t</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: 'Privacy First',
                desc: 'All face recognition runs entirely on your device. Your biometric data is never uploaded or stored on any server.',
                badge: 'Zero data risk',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Blazing Fast',
                desc: 'Search through 500+ event photos in under 3 seconds. Optimised AI models make matching feel instant.',
                badge: 'Under 3 seconds',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'High Accuracy',
                desc: 'Advanced face embedding technology provides 99% accurate matches even in group photos or side angles.',
                badge: '99% accurate',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Works Everywhere',
                desc: 'Fully responsive design works perfectly on mobile, tablet and desktop browsers without any installation.',
                badge: 'Any device',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                ),
                title: 'Bulk Download',
                desc: 'Download all your matched photos in one go. No watermarks, full resolution, ready to share.',
                badge: 'Full resolution',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Easy Admin',
                desc: 'Event organizers can upload photos to the gallery in minutes with a simple, intuitive admin panel.',
                badge: 'For organizers',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#e0f7fa] text-[#158fa8] rounded-xl mb-5">
                  {f.icon}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-[#0a4f5c] text-base">{f.title}</h3>
                  <span className="text-[10px] font-bold bg-[#e0f7fa] text-[#158fa8] px-2 py-0.5 rounded-full">
                    {f.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#0a4f5c] via-[#158fa8] to-[#1ab3cf] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            Ready to find your photos?
          </h2>
          <p className="text-[#b2ebf2] text-lg mb-10 max-w-xl mx-auto">
            No sign-up, no credit card, no hassle. Just upload your selfie and we&apos;ll do the rest.
          </p>
          <Link
            href="/find"
            id="footer-cta"
            className="inline-flex items-center gap-2 bg-white text-[#158fa8] font-bold px-10 py-4 rounded-full text-base hover:bg-[#e0f7fa] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Try Pixee Now — It&apos;s Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span className="text-xl font-extrabold text-[#158fa8]">
            Pixee<span className="text-[#0a4f5c]">.</span>
          </span>
          <p>© {new Date().getFullYear()} Pixee. AI-powered photo discovery. Privacy first.</p>
          <div className="flex gap-6">
            <Link href="/find" className="hover:text-[#158fa8] transition-colors">Find Photos</Link>
            <Link href="/admin" className="hover:text-[#158fa8] transition-colors">Admin</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
