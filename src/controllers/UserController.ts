import User, { IUser } from '../models/User';

import express, { Request, Response } from 'express';
import { CallbackError, isValidObjectId } from 'mongoose';

const router = express.Router();

// GET Users
router.get('/', 
  async (req: Request, res: Response) => {

    await User.find((error: CallbackError, docs: IUser) => {
      handleUserError(error, docs, res, 500);
    });
  }
);

// GET User by id
router.get('/:id', 
  async (req: Request, res: Response) => {

    if (idExists(req, res) === true) {
      await User.findById(req.params.id, 
        (error: CallbackError, docs: IUser) => {
          handleUserError(error, docs, res, 500);
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
      handleUserError(error, docs, res, 500);
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
          handleUserError(error, docs, res, 500);
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
          handleUserError(error, docs, res, 500);
      });
    }
  }
);

function idExists(req: Request, res: Response): boolean | Response {
  if (isValidObjectId(req.params.id)) return true;
      
  else return res.status(404)
                 .send(`[ERROR] User with id ${req.params.id} not found`);
}

function handleUserError(
    error: CallbackError, 
    docs: IUser | null,
    res: Response, 
    status: number
  ): void {

  if (!error) res.send(docs);

  else res.status(status).send(`[ERROR] ${error.message}`);
}

export default router;