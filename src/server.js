import express from 'express'

import cors from 'cors'

import listEndpoints from 'express-list-endpoints'

import authorsRouter from '../src/services/authors/index.js'

import blogsRouter from '../src/services/blogs/index.js'

import {badRequestHandler, genericErrorsHandler, unauthorizedHandler, notFoundHandler} from './errorHandlers.js'

const server = express()

console.log(process.env.FE_LOCAL_URL)

const PORT = process.env.PORT

console.log(PORT)

const whiteList = [process.env.FE_LOCAL_URL, process.env.FE_REMOTE_URL]

const corsOptions = {
    
    origin: function (origin, next) {
        // Determine the origin from each request
        console.log("ORIGIN: ", origin)

        if (!origin || whiteList.indexOf(origin) !== -1) {
            // If origin is in the whitelist, approve access
            next(null, true)
        } else {
            // If the origin isn't in the whitelist, deny access
            next(new Error("CORS ERROR"))
        }
    },
}

server.use(cors())

server.use(express.json()) // if dont add before the endpoints all requests will return undefined

server.use("/authors", authorsRouter)

server.use("/blogs", blogsRouter)

// console.log(listEndpoints(server))

server.use(genericErrorsHandler)
server.use(unauthorizedHandler)
server.use(badRequestHandler)
server.use(notFoundHandler)

server.listen(PORT, () => console.log(`Server is running on port: `, PORT))

server.once("error", (error) => console.log(`Server is not running due to: ${error}`))