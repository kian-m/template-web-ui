'use client'

import Button from './ui/Button'

interface CalModalProps {
  url: string
  onClose: () => void
}

export default function CalModal ({ url, onClose }: CalModalProps) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl h-[90vh] bg-white rounded-lg overflow-hidden relative">
        <Button
          onClick={onClose}
          variant="secondary"
          size="sm"
          className="absolute top-4 right-4 z-10"
        >
          Close
        </Button>
        <iframe
          src={url}
          className="w-full h-full border-0"
          title="Schedule"
        />
      </div>
    </div>
  )
}
