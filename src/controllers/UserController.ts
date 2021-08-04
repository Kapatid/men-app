import User, { IUser } from '../models/User';

import { Request, Response } from 'express';
import { CallbackError, isValidObjectId } from 'mongoose';

export const getUsers = async(req: Request, res: Response) => {
  await User.find((error: CallbackError, docs: IUser) => {
    handleUserError(error, docs, res, 500);
  });
}

export const getUser = async(req: Request, res: Response) => {
  if (idExists(req, res) === true) {
    await User.findById(req.params.id, 
      (error: CallbackError, docs: IUser) => {
        handleUserError(error, docs, res, 500);
      }
    );
  }
}

export const createUser = async(req: Request, res: Response) => {
  const user: IUser = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  user.save((error: CallbackError, docs: IUser) => {
    handleUserError(error, docs, res, 500);
  }); 
}

export const updateUser = async(req: Request, res: Response) => {
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
      }
    );
  }
}

export const deleteUser = async(req: Request, res: Response) => {
  if (idExists(req, res) === true) {
    await User.findByIdAndDelete(req.params.id, 
      {}, 
      (error: CallbackError, docs: IUser | null) => {
        handleUserError(error, docs, res, 500);
      }
    );
  }
}

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