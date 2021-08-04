import User, { IUser } from '../models/User';

import express, { Request, Response } from 'express';
import { CallbackError, isValidObjectId } from 'mongoose';
import bcrypt from "bcryptjs";

const router = express.Router();

// GET Users
router.get('/', 
  async (req: Request, res: Response) => {

    await User.find((error: CallbackError, docs: IUser) => {
      !error ? res.send(docs) :
      res.status(500)
         .send(`ERROR: ${error.message}`);
    });
  }
);

// GET User by id
router.get('/:id', 
  async (req: Request, res: Response) => {

    if (idExists(req, res) === true) {
      await User.findById(req.params.id, (error: CallbackError, docs: IUser) => {
        !error ? res.send(docs) :
        res.status(500)
           .send(`ERROR: ${error.message}`);
      });
    }
  }
);

// CREATE New User
router.post('/', 
  async (req: Request, res: Response) => {

    const user: IUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    });

    user.save((error: CallbackError, docs: IUser) => {
      if (!error) res.send(docs);

      else {
        res.status(500)
           .send(`ERROR: ${error.message}`);
      }
    }); 
  }
);

// UPDATE User
router.put('/:id', 
  async (req: Request, res: Response) => {

    const user = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    };

    if (idExists(req, res) === true) {
      await User.findByIdAndUpdate(req.params.id,
        { $set: user }, 
        (error: CallbackError, docs: IUser | null) => {
          if (!error) res.send(docs);

          else {
            res.status(500)
               .send(`ERROR: ${error.message}`);
          }
        });
    }
  }
);

// DELETE User
router.delete('/:id', 
  async (req: Request, res: Response) => {

    if (idExists(req, res) === true) {
      await User.findByIdAndDelete(req.params.id, 
        {}, 
        (error: CallbackError, docs: IUser | null) => {
        if (!error) res.send(docs);

        else {
          res.status(500)
             .send(`ERROR: ${error}`);
        }
      });
    }
  }
);

function idExists(req: Request, res: Response): boolean | Response {
  if (!isValidObjectId(req.params.id)) {
    return res.status(404).send(`User with id ${req.params.id} not found`);
  }
      
  else return true;
}

export default router;