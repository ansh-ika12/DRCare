'use client'

import { useState, useRef } from 'react'

async function runScreening(file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/screen`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Screening request failed')
  }

  const data = await res.json()

  return {
    quality: { pass: data.quality_ok, message: data.quality_message },
    grade: data.quality_ok ? { value: data.grade, confidence: data.confidence } : null,
    referral: data.quality_ok ? data.referral_text : null,
    structureImage: data.structure_overlay ? `data:image/png;base64,${data.structure_overlay}` : null,
    gradcamImage: data.gradcam_overlay ? `data:image/png;base64,${data.gradcam_overlay}` : null,
  }
}

export default function Screening() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | done | error
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
    try {
      const output = await runScreening(file)
      setResult(output)
      setStatus('done')
    } catch (err) {
      setResult(null)
      setStatus('error')
    }
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

          {/* Error state */}
          {status === 'error' && (
            <div className="mt-10 text-center">
              <p className="text-red-600 font-semibold">Something went wrong reaching the screening service.</p>
              <p className="text-sm text-slate-500 mt-1">Please check your connection and try again.</p>
            </div>
          )}

          {/* Results */}
          {status === 'done' && result && (
            <div className="mt-10">
              {!result.quality.pass ? (
                <div className="bg-yellow-50 rounded-2xl p-6 text-center">
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Quality Check</p>
                  <p className="font-heading font-bold text-navy">{result.quality.message}</p>
                </div>
              ) : (
                <>
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
                    <div className={`rounded-2xl p-6 ${result.referral === 'REFER TO OPHTHALMOLOGIST' ? 'bg-red-50' : 'bg-green-50'}`}>
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Referral Decision</p>
                      <p className={`font-heading font-bold ${result.referral === 'REFER TO OPHTHALMOLOGIST' ? 'text-red-600' : 'text-green-600'}`}>
                        {result.referral}
                      </p>
                    </div>
                  </div>

                  {/* Row 2: image outputs */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-3 px-2">Structure Visualization</p>
                      {result.structureImage && (
                        <img src={result.structureImage} alt="Structure visualization output" className="w-full rounded-xl" />
                      )}
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-3 px-2">Grad-CAM</p>
                      {result.gradcamImage && (
                        <img src={result.gradcamImage} alt="Grad-CAM output" className="w-full rounded-xl" />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}