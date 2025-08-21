'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { X } from 'lucide-react'

interface CalModalContextType {
  open: (link?: string) => void
  close: () => void
}

const CalModalContext = createContext<CalModalContextType>({ open: () => {}, close: () => {} })

export const CalModalProvider = ({ children }: { children: ReactNode }) => {
  const [ isOpen, setIsOpen ] = useState(false)
  const [ link, setLink ] = useState('https://cal.com/thebayarea/consultation?embed=1')

  const open = (url?: string) => {
    setLink(url ?? 'https://cal.com/thebayarea/consultation?embed=1')
    setIsOpen(true)
  }

  const close = () => setIsOpen(false)

  return (
    <CalModalContext.Provider value={{ open, close }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden">
            <button
              onClick={close}
              className="absolute top-3 right-3 text-gray-600 hover:text-academic-navy"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={link}
              className="w-full h-[700px] border-none"
              title="Schedule with Cal.com"
            />
          </div>
        </div>
      )}
    </CalModalContext.Provider>
  )
}

export const useCalModal = () => useContext(CalModalContext)
