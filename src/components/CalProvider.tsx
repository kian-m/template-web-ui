'use client'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import CalModal from './CalModal'

interface CalContextValue {
  open: () => void
  close: () => void
}

const CalContext = createContext<CalContextValue | undefined>(undefined)

export function CalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <CalContext.Provider value={{ open, close }}>
      {children}
      {isOpen && <CalModal onClose={close} />}
    </CalContext.Provider>
  )
}

export function useCal() {
  const ctx = useContext(CalContext)
  if (!ctx) throw new Error('useCal must be used within CalProvider')
  return ctx
}
