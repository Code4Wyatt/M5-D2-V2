import express from 'express'

import fs from 'fs'

import { fileURLToPath } from 'url'

import { dirname, join } from 'path'

import uniqid from 'uniqid'

import createHttpError from 'http-errors'

import { validationResult } from 'express-validator'
import { parseFile, uploadFile } from '../../utils/index.js'

const blogsRouter = express.Router()

const blogsJSONPath = join(dirname(fileURLToPath(import.meta.url)), 'blogs.json')

const getBlogs = () => JSON.parse(fs.readFileSync(blogsJSONPath, 'utf8'))
const writeBlogs = content => fs.writeFileSync(blogsJSONPath, JSON.stringify(content))

// Create blog

blogsRouter.post("/", (req, res, next) => {
    try {
        const errorsList = validationResult(req) 
        if (!errorsList.isEmpty()) {
            next(createHttpError(400, "There is an error in the request body", {errorsList}))
        } else {
        const newBlog = { ...req.body, createdAt: new Date(), id: uniqid() }
        const blogs = getBlogs()

        blogs.push(newBlog)
        writeBlogs(blogs)

        res.status(201).send({ id: newBlog.id })
        }
    } catch (err) {
        next(err)
    }
})

// Get blogs

blogsRouter.get("/", (req, res, next) => {
    try {
        const blogs = getBlogs()

        if (req.query && req.query.category) {
            const filteredBooks = books.filter(book => book.category === req.query.category)
            res.send(filteredBooks)
        } else {
            res.send(blogs)
        }
    } catch (err) {
        next(err)
    }
})

// Get single blog

blogsRouter.get("/:blogId", (req, res, next) => {
    try {
        const blogs = getBlogs()

        const blog = blogs.find(blog => blog.id === req.params.blogId)
        if (blog) {
            res.send(blog)
        } else {
            next(createHttpError(404, `Blog with ID ${req.params.blogId} not found`))
        }
    } catch (err) {
        next(err)
    }
})

// Edit blog

blogsRouter.put("/:blogId", (req, res, next) => {
    try {
        const blogs = getBlogs()

        const index = blogs.findIndex(blogs => blogs.id === req.params.blogId)

        const blogToModify = blogs.find(blog => blog.id === req.params.blogId)[index]
        const updatedFields = req.body
        
        const updatedBlog = { ...blogToModify, ...updatedFields, updatedAt: new Date() }

        blogs[index] = updatedBlog
        
        writeBlogs(blogs)

        res.send(updatedBlog)
    } catch (error) {
        next(error)
    }
})

// Edit blog cover

blogsRouter.put("/:id/cover", parseFile.single("cover"), uploadFile, async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(blogsJSONPath)
        const fileAsString = fileAsBuffer.toString()

        let fileAsJSONArray = JSON.parse(fileAsString)

        const blogIndex = fileAsJSONArray.findIndex((blog) => blog.id === req.params.id)
        if (!blogIndex == -1) {
            res.status(404).send({ message: `blog with ${req.params.id} not found`})
        }
        const previousblogData = fileAsJSONArray[blogIndex]
        const changedblog = {
            ...previousblogData,
            cover: req.file,
            updatedAt: new Date(),
            id: req.params.id,
        }
        fileAsJSONArray[blogIndex] = changedblog

        fs.writeFileSync(blogsJSONPath, JSON.stringify(fileAsJSONArray))
        res.send(changedblog)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// Delete blog

blogsRouter.delete("/:blogId", (req, res, next) => {
    try {
        const blogs = getBlogs()
        const remainingBlogs = blogs.filter(blog => blog.id !== req.params.blogId)

        writeBlogs(remainingBlogs)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

blogsRouter.get("/downloadJSON", async (req, res, next) => {
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

blogsRouter.get("/:blogId/downloadPDF", async (req, res, next) => {
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

export default blogsRouter