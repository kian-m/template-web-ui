'use client'
import { X } from 'lucide-react'

interface CalModalProps {
  onClose: () => void
}

export default function CalModal({ onClose }: CalModalProps) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl h-[80vh] bg-white rounded-lg overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          aria-label="Close schedule modal"
        >
          <X className="w-6 h-6" />
        </button>
        <iframe
          src="https://cal.com/thebayarea/consultation?embed=1"
          className="w-full h-full border-0"
          title="Schedule consultation"
        />
      </div>
    </div>
  )
}
