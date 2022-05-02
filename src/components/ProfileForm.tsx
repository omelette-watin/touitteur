import api from "@/api/api"
import useAuth from "@/hooks/useAuth"
import useModal from "@/hooks/useModal"
import { CameraIcon } from "@heroicons/react/outline"
import Image from "next/image"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { storage } from "@/firebase/firebase"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import CropImage from "./CropImage"
import Tooltip from "./ui/Tooltip"

const PROFILENAME_MAX_CHAR = 20
const BIO_MAX_CHAR = 160
const ProfileForm = () => {
  const { setModal } = useModal()
  const { user, setUser } = useAuth()
  const [profileName, setProfileName] = useState(user?.profileName)
  const [bio, setBio] = useState(user?.bio || "")
  const [urlAvatar, setUrlAvatar] = useState(
    user?.urlAvatar || "/avatars/default.svg"
  )
  const [image, setImage] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showCrop, setShowCrop] = useState(false)
  const handleChangeProfileName = (e: any) => {
    if (e.target.value.length <= PROFILENAME_MAX_CHAR) {
      setProfileName(e.target.value)
    }
  }
  const handleChangeBio = (e: any) => {
    if (e.target.value.length <= BIO_MAX_CHAR) {
      setBio(e.target.value)
    }
  }
  const handleSubmit = (e: any) => {
    e.preventDefault()
    setSubmitting(true)

    if (image) {
      const newImageName = `${uuidv4()}.jpeg`
      const imageRef = ref(storage, `/avatars/${newImageName}`)
      const upload = uploadBytesResumable(imageRef, image)

      return upload.on(
        "state_changed",
        () => {},
        () => {},
        () => {
          getDownloadURL(upload.snapshot.ref).then((downloadURL) => {
            api
              .post("/users/me", { bio, profileName, urlAvatar: downloadURL })
              .then(() => {
                if (user) {
                  setUser({
                    ...user,
                    bio,
                    profileName,
                    urlAvatar: downloadURL,
                  })
                }

                setModal("")
              })
          })
        }
      )
    } else {
      api.post("/users/me", { bio, profileName }).then(() => {
        if (user) {
          setUser({
            ...user,
            bio,
            profileName,
          })
        }

        setModal("")
      })
    }

    setSubmitting(false)
  }
  const uploadToClient = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const i = e.target.files[0]

      setImage(i)
      setUrlAvatar(URL.createObjectURL(i))
      setShowCrop(true)
    }
  }
  const handleCloseModal = () => setModal("")

  return (
    <>
      {showCrop && (
        <CropImage
          urlAvatar={urlAvatar}
          closeCrop={() => {
            setShowCrop(false)
          }}
          setCroppedImage={setImage}
          setCroppedUrl={setUrlAvatar}
        />
      )}
      {!showCrop && (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4 p-4 text-slate-200">
            <label
              htmlFor="avatar"
              className="group relative block h-[100px] w-[100px] rounded-full border-4 sm:h-[150px] sm:w-[150px]"
            >
              <Image
                src={urlAvatar as string}
                width={150}
                height={150}
                className="rounded-full"
                alt="Votre avatar"
              />
              <div className="group-hover:border-twitter group-hover:text-twitter absolute top-1/2 left-1/2 flex h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border-4 bg-neutral-700/10 transition-colors ease-in-out sm:h-[150px] sm:w-[150px]">
                <CameraIcon height={50} className="opacity-80" />
              </div>
              <Tooltip>Changer d'avatar</Tooltip>
            </label>
            <input
              type="file"
              name="myImage"
              id="avatar"
              className="hidden"
              accept=".png,.jpg,.jpeg,.gif"
              onChange={uploadToClient}
            />

            <div className="flex justify-between">
              Profilename{" "}
              <span className="text-sm text-gray-500">
                {profileName?.length} / {PROFILENAME_MAX_CHAR}
              </span>
            </div>
            <input
              type="text"
              name="profilename"
              placeholder="Profilename"
              onChange={handleChangeProfileName}
              value={profileName}
              className="w-full rounded-md border border-white bg-black py-2 px-3 focus:border-[#1d9bf0] focus:outline-none"
            />
            <div className="flex justify-between">
              Bio{" "}
              <span className="text-sm text-gray-500">
                {bio.length} / {BIO_MAX_CHAR}
              </span>
            </div>
            <textarea
              rows={3}
              value={bio}
              onChange={handleChangeBio}
              className="w-full resize-none rounded-md border border-white bg-black py-2 px-3 focus:border-[#1d9bf0] focus:outline-none"
              placeholder="Your bio..."
            />
            <div className="flex items-center justify-center space-x-4 pt-2 text-lg sm:pt-8">
              <button
                className="w-fit self-center rounded-full border px-6 py-1 hover:border-red-600 hover:bg-red-600/10 hover:text-red-600"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                type="submit"
                className="bg-twitter disabled:bg-twitter/50 w-fit self-center rounded-full px-6 py-1 transition ease-in-out hover:bg-[#1a8cd8] disabled:cursor-default"
              >
                {submitting ? "Saving" : "Save"}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  )
}

export default ProfileForm
