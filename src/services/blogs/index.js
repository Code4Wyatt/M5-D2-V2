import express from 'express'

import fs from 'fs'

import { fileURLToPath } from 'url'

import { dirname, join } from 'path'

import uniqid from 'uniqid'

import createHttpError from 'http-errors'

import { validationResult } from 'express-validator'

const blogsRouter = express.Router()

const blogsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogs.json")

const getBlogs = () => JSON.parse(fs.readFileSync(blogsJSONPath, 'utf8'))
const writeBlogs = content = fs.writeFileSync(blogsJSONPath, JSON.stringify(content))

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

blogsRouter.put("/:blogId", (req, res, next) => {
    try {
        const blogs = getBlogs()

        const index = blogs.findIndex(blogs => blog.id === req.params.blogId)

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

export default blogsRouter