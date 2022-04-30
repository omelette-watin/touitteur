import getCroppedImg from "@/utils/getCroppedImage"
import { useCallback, useState } from "react"
import Cropper from "react-easy-crop"
import { Point } from "react-easy-crop/types"

interface CropImageProps {
  urlAvatar: string
  closeCrop: any
  setCroppedImage: any
  setCroppedUrl: any
}

const CropImage = ({
  urlAvatar,
  closeCrop,
  setCroppedImage,
  setCroppedUrl,
}: CropImageProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const onCropComplete = useCallback(
    (_croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )
  const getImage = useCallback(async () => {
    try {
      if (croppedAreaPixels) {
        const res = await getCroppedImg(urlAvatar, croppedAreaPixels)

        if (res) {
          const { croppedImage, croppedUrl } = res
          setCroppedImage(croppedImage)
          setCroppedUrl(croppedUrl)
          closeCrop()
        }
      }
    } catch (err) {
      closeCrop()
    }
  }, [croppedAreaPixels, setCroppedImage, setCroppedUrl, urlAvatar, closeCrop])

  return (
    <div className="p-4 text-slate-200">
      <p className="pb-6 text-center text-xl font-bold">Edit your avatar</p>
      <div className="relative h-[400px] w-full rounded-xl bg-gray-600">
        <Cropper
          image={urlAvatar}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="flex items-center justify-center space-x-4 pt-8 text-lg">
        <button
          type="button"
          onClick={closeCrop}
          className="w-fit self-center rounded-full border px-6 py-1 hover:border-red-600 hover:bg-red-600/10 hover:text-red-600"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={getImage}
          className="bg-twitter w-fit self-center rounded-full px-6 py-1 transition ease-in-out hover:bg-[#1a8cd8]"
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default CropImage