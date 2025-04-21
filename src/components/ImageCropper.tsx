"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { getCroppedImg } from "@/lib/cropUtils"
import { Button } from "@/components/ui/button"
import type { Area } from "react-easy-crop"

interface ImageCropperProps {
  file: File
  onCropDone: (croppedImageUrl: string) => void
  onCancel: () => void
}

export default function ImageCropper({ file, onCropDone, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleDone = async () => {
    if (!croppedAreaPixels) return

    try {
      const croppedImage = await getCroppedImg(file, croppedAreaPixels)
      if (croppedImage) {
        onCropDone(croppedImage)
      }
    } catch (error) {
      console.error("Error cropping image:", error)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg w-[90vw] max-w-[500px] h-[70vh] relative flex flex-col">
        <div className="relative flex-grow mb-4">
          <Cropper
            image={URL.createObjectURL(file)}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="flex justify-end gap-2 z-[110] relative">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleDone}>Crop & Insert</Button>
        </div>
      </div>
    </div>
  )
}
