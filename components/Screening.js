'use client'

import { useState, useRef } from 'react'

// Placeholder — replace this with a real call to your inference API,
// e.g. POST the file to `/api/screen` and return its JSON response
// in this same shape: { quality, grade, referral }
async function runScreeningMock(file) {
  await new Promise((resolve) => setTimeout(resolve, 1800))

  const grade = Math.floor(Math.random() * 5) // 0-4
  const refer = grade >= 2

  return {
    quality: { pass: true, message: 'Image quality: Pass' },
    grade: { value: grade, confidence: (85 + Math.random() * 10).toFixed(1) },
    referral: refer ? 'Refer to Ophthalmologist' : 'Routine',
  }
}

export default function Screening() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | done
  const [result, setResult] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (selected) => {
    if (!selected || !selected.type.startsWith('image/')) return
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
    setStatus('idle')
    setResult(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleRun = async () => {
    if (!file) return
    setStatus('loading')
    const output = await runScreeningMock(file)
    setResult(output)
    setStatus('done')
  }

  const handleReset = () => {
    setFile(null)
    setPreviewUrl(null)
    setStatus('idle')
    setResult(null)
  }

  return (
    <section id="screening" className="bg-sky-light py-20">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-center uppercase tracking-widest text-sky font-semibold text-sm mb-3">Try It</p>
        <h2 className="text-center font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">
          Run a Screening
        </h2>
        <p className="text-center text-slate-600 max-w-lg mx-auto mb-12">
          After the quality check, poor images are rejected, borderline images are enhanced with CLAHE, and optimal images bypass enhancement. Eligible images continue to DR grading and referral.
        </p>

        <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
              dragActive ? 'border-sky bg-sky-light' : 'border-slate-200 hover:border-sky'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {previewUrl ? (
              <div className="flex flex-col items-center gap-3">
                <img src={previewUrl} alt="Uploaded fundus photo" className="w-40 h-40 object-cover rounded-xl" />
                <p className="text-sm text-slate-500">{file?.name}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); handleReset() }}
                  className="text-sm text-sky font-semibold hover:underline"
                >
                  Choose a different photo
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V4M12 4L7 9M12 4L17 9" stroke="#3B9EF0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 16V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V16" stroke="#3B9EF0" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <p className="font-heading font-semibold text-navy">Drag & drop a retina photo</p>
                <p className="text-sm text-slate-500">or click to browse: JPG or PNG</p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleRun}
              disabled={!file || status === 'loading'}
              className="bg-navy text-white font-semibold px-8 py-3.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy-dark transition-colors"
            >
              {status === 'loading' ? 'Analyzing…' : 'Run Screening'}
            </button>
          </div>

          {/* Loading state */}
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-3 mt-10 text-slate-500">
              <div className="w-8 h-8 border-2 border-sky border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Running quality check, grading, and explainability…</p>
            </div>
          )}

          {/* Results */}
          {status === 'done' && result && (
            <div className="mt-10">
              {/* Row 1: text outputs */}
              <div className="grid md:grid-cols-3 gap-5 mb-6">
                <div className="bg-slate-50 rounded-2xl p-6">
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Quality Check</p>
                  <p className="font-heading font-bold text-navy">{result.quality.message}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6">
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">DR Grade</p>
                  <p className="font-heading font-bold text-navy">
                    Grade {result.grade.value} · {result.grade.confidence}%
                  </p>
                </div>
                <div className={`rounded-2xl p-6 ${result.referral === 'Refer to Ophthalmologist' ? 'bg-red-50' : 'bg-green-50'}`}>
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Referral Decision</p>
                  <p className={`font-heading font-bold ${result.referral === 'Refer to Ophthalmologist' ? 'text-red-600' : 'text-green-600'}`}>
                    {result.referral}
                  </p>
                </div>
              </div>

              {/* Row 2: image outputs */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-3 px-2">Structure Visualization</p>
                  <img src={previewUrl} alt="Structure visualization output" className="w-full rounded-xl" />
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-3 px-2">Grad-CAM</p>
                  <img src={previewUrl} alt="Grad-CAM output" className="w-full rounded-xl" />
                </div>
              </div>

              <p className="text-center text-xs text-slate-400 mt-6">
                Demo output: connect this section to your inference API to show the real structure map and Grad-CAM heatmap.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}