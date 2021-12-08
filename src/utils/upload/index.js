import path, { dirname, extname, join } from 'path'

import fs from 'fs'

import multer from 'multer'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

export const authorsFilePath = join(process.cwd(), "./src/services/authors/authors.json")

export const blogsFilePath = join(process.cwd(), "./src/services/blogs/blogs.json")

const publicDirectory = path.join(process.cwd(), "./public")

export const parseFile = multer()

export const uploadFile = (req, res, next) => {
    try {
        const { originalname, buffer } = req.file
        const extension = extname(originalname)
        const fileName = `${req.params.id}${extension}`
        const pathToFile = path.join(publicDirectory, fileName)
        fs.writeFileSync(pathToFile, buffer)
        const link = `http://localhost:3000/${fileName}`
        req.file = link
        next()
    } catch (err) {
        next(err)
    }
}

