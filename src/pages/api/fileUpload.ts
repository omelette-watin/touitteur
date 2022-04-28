import { Request, Response } from "express"
// @ts-ignore
import Formidable from "formidable-serverless"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"
import { URL } from "url"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function uploadAvatar(req: Request, res: Response) {
  return new Promise((resolve, reject) => {
    const form = new Formidable.IncomingForm({
      multiples: true,
      keepExtensions: true,
    })

    form
      .on(
        "file",
        (name: string, file: { path: string | Buffer | URL; name: string }) => {
          const data = fs.readFileSync(file.path)
          const splittedImageName = file.name.split(".")
          const extension = splittedImageName[splittedImageName.length - 1]
          const newImageName = `${uuidv4()}.${extension}`

          fs.writeFileSync(`public/avatars/${newImageName}`, data)
          fs.unlinkSync(file.path)
        }
      )
      .on("aborted", () => {
        reject(res.status(500).send("Aborted"))
      })
      .on("end", () => {
        resolve(res.status(200).send("done"))
      })

    form.parse(req)
  })
}
