import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  pickIntInclusive,
  pickIntInclusiveExcluding
} from '../utils/pickIntInclusive'
import { type Range } from '../interfaces/range'

const RANGE: Range = { min: 1, max: 100 }
const SHOW_MS = 5_000

export default function SecretNumberGenerator(): React.JSX.Element {
  // Gerador principal (com timeout)
  const [current, setCurrent] = useState<number | null>(null)

  // Gerador único (sempre visível)
  const [single, setSingle] = useState<number | null>(null)

  const [isCoolingDown, setIsCoolingDown] = useState(false)


  const previousRef = useRef<number | null>(null)
  const generatedRef = useRef<number[]>([])
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearHideTimer = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }, [])

const scheduleHide = useCallback(() => {
  clearHideTimer()
  hideTimeoutRef.current = setTimeout(() => {
    setCurrent(null)
    setIsCoolingDown(false)
    hideTimeoutRef.current = null
  }, SHOW_MS)
}, [clearHideTimer])

  const generate = useCallback(() => {
  if (isCoolingDown) return

  const prev = previousRef.current
  const next =
    typeof prev === 'number'
      ? pickIntInclusiveExcluding(RANGE, prev)
      : pickIntInclusive(RANGE)

  previousRef.current = next
  generatedRef.current.push(next)

  console.log('Generated numbers:', [...generatedRef.current])

  setCurrent(next)
  setIsCoolingDown(true)
  scheduleHide()
}, [isCoolingDown, scheduleHide])

  // 🔹 Gerador que só pode ser usado uma vez
  const generateSingle = useCallback(() => {
    if (single !== null) return

    const value = pickIntInclusive(RANGE)
    setSingle(value)

    console.log('Single generated number:', value)
  }, [single])

  const reset = useCallback(() => {
    clearHideTimer()
    previousRef.current = null
    generatedRef.current = []

    setCurrent(null)
    setSingle(null)
    setIsCoolingDown(false)
    console.log('Generated numbers:', [])
  }, [clearHideTimer])

  useEffect(() => {
    return () => {
      clearHideTimer()
    }
  }, [clearHideTimer])

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="pb-2 text-lg font-semibold text-gray-900">
            Gerador ITO
          </h2>
          <a
            href="../../public/temas.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="my-2 block w-[50%] rounded-2xl bg-emerald-600 px-2 py-1 
            text-center text-sm font-semibold text-white hover:opacity-90"
          >
            Abrir PDF
          </a>
          <p className="text-sm text-gray-600">
            Não repete o número anterior.
          </p>
          <p className="text-sm text-gray-600">
            O número aparece por 5s.
          </p>
        </div>

        <button
          type="button"
          onClick={reset}
          className="rounded-xl px-3 py-2 text-sm font-medium
          text-red-700 bg-red-300 hover:opacity-90"
        >
          Reset
        </button>
      </div>

      {/* Gerador principal */}
      <div className="mb-2 mt-5 flex items-center justify-between rounded-2xl bg-gray-50 p-4">
        <span className="text-sm font-medium text-gray-700">
          Número atual
        </span>
        <span className="text-3xl font-bold tabular-nums text-gray-900">
          {current ?? '—'}
        </span>
      </div>

      {/* Gerador único */}
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-blue-50 p-4">
        <span className="text-sm font-medium text-blue-700">
          Número Pergunta
        </span>
        <span className="text-3xl font-bold tabular-nums text-blue-900">
          {single ?? '—'}
        </span>
      </div>

      <button
        type="button"
        onClick={generate}
        disabled={isCoolingDown}
        className="mb-2 w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm 
        font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-90"
      >
        Gerar Nº
      </button>

      <button
        type="button"
        onClick={generateSingle}
        disabled={single !== null}
        className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm 
        font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-90"
      >
        Gerar Nº da pergunta
      </button>
    </div>
  )
}
