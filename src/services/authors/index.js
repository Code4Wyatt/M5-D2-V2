import express from 'express';

import fs from 'fs'; // File System - allows you to work with the file system on your computer

import uniqid from 'uniqid'; // Used for creating unique ID's

import { fileURLToPath } from 'url'; // Converts the url to picomatch

import path, {dirname} from "path"; // Dirname gives us the absolute path of the directory the currently executed file is in

const __filename = fileURLToPath(import.meta.url); // Storing the file's directory as a path

const __dirname = dirname(__filename); // Storing the filename path as the directory name

const authorsRouter = express.Router(); 

// Create new author

authorsRouter.post("/", async (req, res, next) => {
    try {
        const { name, surname, email, dateOfBirth } = req.body; // Destructuring the request

        const author = {    // Creating the structure for the author
            id: uniqid(),
            name,
            surname, 
            email,
            dateOfBirth,
            avatar: `https://ui-avatars.com/api/?name=${name}+${surname}`,
            createdAt: new Date(),
            updateAt: new Date(),        
        };

        const fileAsBuffer = fs.readFileSync(authorsFilePath); // File as standard directory location

        const fileAsAString = fileAsBuffer.toString(); // Directory location in string format

        const fileAsJsonArray = JSON.parse(fileAsAString); // Parsing the file above into a JSON array

        fileAsJSONArray.push(author); // Pushing the author req.body into the JSON array

        fs.writeFileSync(authorsFilePath, JSON.stringify(fileAsJSONArray)); // Writing to the authors file path, inserting JSON Array as string

        res.send(author); // Sending the authors data
    } catch (error) {
        res.send(500).send({ message: error.message });
    }
})

// Get all authors
authorsRouter.get("/", async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(authorsFilePath); // Read the file 
        const fileAsString = fileAsBuffer.toString(); // Convert to string
        const fileAsJSON = JSON.parse(fileAsString); // Insert into JSON object

        res.send(fileAsJSON); // Send the JSON object
    } catch (error) {
        res.send(500).send({ message: error.message });
    }
});

// get single authors
authorsRouter.get("/:id", async (req, res, next) => {
    try {
      const fileAsBuffer = fs.readFileSync(authorsFilePath);
  
      const fileAsString = fileAsBuffer.toString();
  
      const fileAsJSONArray = JSON.parse(fileAsString);
  
      const author = fileAsJSONArray.find(
        (author) => author.id === req.params.id
      );
      if (!author) {
        res
          .status(404)
          .send({ message: `Author with ${req.params.id} is not found!` });
      }
      res.send(author);
    } catch (error) {
      res.send(500).send({ message: error.message });
    }
  });
  
  // delete  author
  authorsRouter.delete("/:id", async (req, res, next) => {
    try {
      const fileAsBuffer = fs.readFileSync(authorsFilePath);
  
      const fileAsString = fileAsBuffer.toString();
  
      let fileAsJSONArray = JSON.parse(fileAsString);
  
      const author = fileAsJSONArray.find(
        (author) => author.id === req.params.id
      );
      if (!author) {
        res
          .status(404)
          .send({ message: `Author with ${req.params.id} is not found!` });
      }
      fileAsJSONArray = fileAsJSONArray.filter(
        (author) => author.id !== req.params.id
      );
      fs.writeFileSync(authorsFilePath, JSON.stringify(fileAsJSONArray));
      res.status(204).send();
    } catch (error) {
      res.send(500).send({ message: error.message });
    }
  });
  
  //  update author
  authorsRouter.put("/:id", async (req, res, next) => {
    try {
      const fileAsBuffer = fs.readFileSync(authorsFilePath);
  
      const fileAsString = fileAsBuffer.toString();
  
      let fileAsJSONArray = JSON.parse(fileAsString);
  
      const authorIndex = fileAsJSONArray.findIndex(
        (author) => author.id === req.params.id
      );
      if (!authorIndex == -1) {
        res
          .status(404)
          .send({ message: `Author with ${req.params.id} is not found!` });
      }
      const previousAuthorData = fileAsJSONArray[authorIndex];
      const changedAuthor = {
        ...previousAuthorData,
        ...req.body,
        updatedAt: new Date(),
        id: req.params.id,
      };
      fileAsJSONArray[authorIndex] = changedAuthor;
  
      fs.writeFileSync(authorsFilePath, JSON.stringify(fileAsJSONArray));
      res.send(changedAuthor);
    } catch (error) {
      res.send(500).send({ message: error.message });
    }
  });
  
  // authorsRouter.put(
  //   "/:id/avatar",
  //   parseFile.single("avatar"), // parse/analyse single file titled avatar
  //   uploadFile, 
  //   async (req, res, next) => {
  //     try {
  //       const fileAsBuffer = fs.readFileSync(authorsFilePath);
  
  //       const fileAsString = fileAsBuffer.toString();
  
  //       let fileAsJSONArray = JSON.parse(fileAsString);
  
  //       const authorIndex = fileAsJSONArray.findIndex(
  //         (author) => author.id === req.params.id
  //       );
  //       if (!authorIndex == -1) {
  //         res
  //           .status(404)
  //           .send({ message: `Author with ${req.params.id} is not found!` });
  //       }
  //       const previousAuthorData = fileAsJSONArray[authorIndex];
  //       const changedAuthor = {
  //         ...previousAuthorData,
  //         avatar: req.file,
  //         updatedAt: new Date(),
  //         id: req.params.id,
  //       };
  //       fileAsJSONArray[authorIndex] = changedAuthor;
  //       fs.writeFileSync(authorsFilePath, JSON.stringify(fileAsJSONArray));
  //       res.send(changedAuthor);
  //     } catch (error) {
  //       res.send(500).send({ message: error.message });
  //     }
  //   }
  // );
  
  export default authorsRouter;

