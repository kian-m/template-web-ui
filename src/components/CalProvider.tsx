'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import CalModal from './CalModal'

interface CalContextValue {
  open: (url?: string) => void
  close: () => void
}

const CalContext = createContext<CalContextValue | undefined>(undefined)
const defaultUrl = 'https://cal.com/thebayarea/consultation?embed=1'

export function CalProvider ({ children }: { children: ReactNode }) {
  const [ isOpen, setIsOpen ] = useState(false)
  const [ url, setUrl ] = useState(defaultUrl)

  const open = (link: string = defaultUrl) => {
    setUrl(link)
    setIsOpen(true)
  }
  const close = () => setIsOpen(false)

  return (
    <CalContext.Provider value={{ open, close }}>
      {children}
      {isOpen && <CalModal url={url} onClose={close} />}
    </CalContext.Provider>
  )
}

export function useCal () {
  const ctx = useContext(CalContext)
  if (!ctx) throw new Error('useCal must be used within CalProvider')
  return ctx
}
