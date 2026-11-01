const MAX_BYTES = 300 * 1024
const MAX_WIDTH = 1200

const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not read that image.'))
    img.src = url
  })

// Approximate decoded size of a base64 data URL.
const dataUrlBytes = (dataUrl) => Math.ceil(((dataUrl.length - dataUrl.indexOf(',') - 1) * 3) / 4)

/** Resizes and re-encodes an image file as a JPEG data URL under 300KB. Runs fully client-side. */
export async function compressImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.')
  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await loadImage(objectUrl)
    let width = Math.min(MAX_WIDTH, img.width)
    let quality = 0.85
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = Math.round((img.height * width) / img.width)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', quality)
      if (dataUrlBytes(dataUrl) <= MAX_BYTES) return dataUrl
      quality = Math.max(0.5, quality - 0.1)
      width = Math.round(width * 0.8)
    }
    throw new Error('That image is too large to store. Try a smaller one.')
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
