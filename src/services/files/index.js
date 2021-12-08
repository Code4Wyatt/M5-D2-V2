import express from "express"
import multer from "multer"
import createHttpError from "http-errors"
import { saveUsersAvatars } from "../../lib/fs-tools.js"

const filesRouter = express.Router()

const uploader = multer({
  fileFilter: (req, file, multerNext) => {
    if (file.mimetype !== "image/gif") {
      multerNext(createHttpError(400, "only gifs are allowed"))
    } else {
      multerNext(null, true)
    }
  },
}).single("profilePic")

filesRouter.post("/uploadSingle", uploader, async (req, res, next) => {
  // "profilePic" does need to match exactly the name used in FormData field, otherwise Multer is not going to be able to find the file
  try {
    console.log("FILE: ", req.file)
    await saveUsersAvatars(req.file.originalname, req.file.buffer)
    // modify user record by adding/editing avatar field

    // 1. get blog posts

    // 2. find specific blog post by id

    // 3. add/edit cover field

    // 4. save blogposts back into blogpost.json
    res.send("OK")
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/uploadMultiple", multer().array("profilePic"), async (req, res, next) => {
  try {
    console.log("FILES: ", req.files)
    const arrayOfPromises = req.files.map(file => saveUsersAvatars(file.originalname, file.buffer))
    await Promise.all(arrayOfPromises)
    res.send("Ok")
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/uploadCloudinary", multer({ storage: cloudStorage }).single("profilePic"), async (req, res, next) => {
  try {
    console.log(req.file)

    // multer-cloudinary is givin us back a req.file which contains also a PATH
    // we should save that path into our databases when we upload books covers or users avatars
    res.send("Image uploaded on Cloudinary!")
  } catch (error) {
    next(error)
  }
})

filesRouter.get("/downloadJSON", async (req, res, next) => {
  try {
    res.setHeader("Content-disposition", "attachment; filename=blogjson.json.gz")

    const source = getBlogsReadableStream()
    const transform = createGzip()
    const destination = res
    pipeling(source, transform, destination, err => {
      if(err) next(err)
    })
  } catch (error) {
    next(error)
  }
})

filesRouter.get("/downloadPDF", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=blog.pdf")
    const source = getPDFReadableStream({ firstName: "Paul", lastName: "Murray" })
    const destination = res
    pipeline(source, destination, err => {
      if(err) next(err)
    })
  } catch (error) {
    next(error)
  }
})



export default filesRouter