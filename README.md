# PIXEE - AI Face Recognition for Event Photos

**Upload a selfie → Find your memories instantly**

PIXEE helps users find all photos containing their face among 500+ event photos using client-side AI face recognition.

## 🚀 Live Demo

**Production URL:** [https://pixee-brvp31j7u-saincode-3046s-projects.vercel.app](https://pixee-brvp31j7u-saincode-3046s-projects.vercel.app)

**GitHub Repository:** [https://github.com/saincode/pixee](https://github.com/saincode/pixee)

## 🎯 Features

- **Privacy First**: All AI processing runs on your device
- **Smart Matching**: Advanced face detection using face-api.js
- **Admin Panel**: Event creation and photo management
- **User Portal**: Upload selfie and discover your event photos

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (TypeScript, App Router)
- **Backend & DB**: Supabase
- **AI**: face-api.js (client-side face recognition)
- **Styling**: TailwindCSS
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Setup Steps

1. **Clone repository**
   ```bash
   cd pixee
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   copy env.example.txt .env.local
   ```
   
   Then edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Setup Supabase Database**
   
   Run this SQL in Supabase SQL Editor:
   ```sql
   --Face Detection Models**
   
   Models are already included in `/public/models/`:
   - ✅ tiny_face_detector_model
   - ✅ face_landmark_68_model
   - ✅ face_recognition_model
   
   No additional download needed!
   -- Create photos table
   CREATE TABLE public.photos (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
     image_url TEXT NOT NULL,
     source_type TEXT DEFAULT 'upload',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );

   -- Enable RLS
   ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Allow all for events" ON public.events FOR ALL USING (true);
   CREATE POLICY "Allow all for photos" ON public.photos FOR ALL USING (true);
   ```

   Create Storage Bucket for uploads:
   - Go to Storage → Create bucket named `event-photos` (Public)
   - Add policies for public read and authenticated uploads

5. **Download Face Detection Models**
   
   Download face-api.js models and place in `/public/models/`:
   - tiny_face_detector_model-weights_manifest.json
   - face_landmark_68_model-weights_manifest.json
   - face_recognition_model-weights_manifest.json
   
   Models available at: https://github.com/justadudewhohacks/face-api.js/tree/master/weights

6. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
pixee/
├── app/
│   ├── page.tsx          # Landing page
│   ├── admin/
│   │   └── page.tsx      # Admin panel
│   └── find/
│       └── page.tsx      # User face matching
├── lib/
│   ├── supabase.ts       # Supabase client & types
│   └── faceDetection.ts  # Face-api.js utilities
├── public/
│   └── models/           # Face detection models (to be added)
└── env.example.txt       # Environment variables template
```

## 🗄️ Database Schema

### Events Table
```sql
id          uuid
name        text
code        text (unique)
created_at  timestamp
```

### Photos Table
```sql
id          uuid
event_id    uuid (fk → events.id)
image_url   text
created_at  timestamp
```

## 🎨 Pages

1. **Landing Page** (`/`)
   - App introduction
   - Navigation to admin and find pages

2. **Admin Panel** (`/admin`)
   - Login with Supabase Auth
   - Create events
   - Upload photo URLs

3. **Find Photos** (`/find`)
   - Select event
   - Upload selfie
   - AI face matching
   - Display matched photos

## 🔧 Development Status

- ✅ **Phase 1**: Project setup & dependencies
- ✅ **Phase 2**: Supabase schema & configuration
- ✅ **Phase 3**: Admin page implementation
- ✅ **Phase 4**: AI model integration
- ✅ **Phase 5**: Face matching functionality
- ✅ **Phase 6**: Deployment to Vercel

## 🚀 Deployment

Deploy to Vercel using CLI:

```bash
npm install -g vercel
vercel --prod
```

Or push to GitHub and import in Vercel dashboard.

**Environment Variables Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📝 License

MIT
