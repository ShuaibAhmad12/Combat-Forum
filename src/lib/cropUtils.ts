// lib/cropUtils.ts
import { Area } from "react-easy-crop"

export const getCroppedImg = async (
  file: File,
  pixelCrop: Area
): Promise<string | null> => {
  const image = await createImage(URL.createObjectURL(file))
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) return null

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const blobUrl = URL.createObjectURL(blob)
        resolve(blobUrl)
      }
    }, "image/jpeg")
  })
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener("load", () => resolve(img))
    img.addEventListener("error", (err) => reject(err))
    img.setAttribute("crossOrigin", "anonymous") // Avoid CORS issues
    img.src = url
  })
