"use client"

import { useSearchParams } from 'next/navigation'
import DSAQuizEngine from '@/components/DSAQuizEngine'
import { Suspense } from 'react'

function QuizPageInner() {
  const searchParams = useSearchParams()
  const conceptId = searchParams.get('conceptId')
  return (
    <div className="w-full h-full">
      <DSAQuizEngine conceptId={conceptId} />
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizPageInner />
    </Suspense>
  )
} 