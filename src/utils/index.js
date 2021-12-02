import path, { dirname, extname, join } from 'path'

import fs from 'fs'

import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

export const authorsFilePath = join(dirname(fileURLToPath(import.meta.url)), "../../services/authors/authors.json")

export const blogsFilePath = join(dirname(fileURLToPath(import.meta.url)), "../../services/blogs/blogs.json")

const publicDirectory = path.join(__dirname, "../../../public")

export const parseFile = multer()

export const uploadFile = (req, res, next) => {
    try {
        
    } catch (err) {
        next(err)
    }
}

