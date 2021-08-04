import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
}

const UserSchema = new Schema<IUser>({
  created: { type: Date, default: Date.now},
  updated: { type: Date, default: Date.now},
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
});

UserSchema.pre<IUser>("save", function(next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, (saltError, salt) => {
      if (saltError) return next(saltError);

      bcrypt.hash(user.password, salt, (hashError, hash) => {
        if (hashError) return next(hashError);

        user.password = hash;
        next();
      });
    })
  } else {
    return next();
  }
});

UserSchema.pre("findOneAndUpdate", async function() {
  const docToUpdate = await this.findOne(this.getQuery());

  let newPassword = await bcrypt.hash(docToUpdate.password, 10);

  this.set('password', newPassword);
});

UserSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, (error, isMatch) => {
    if (error) return callback(error);
    
    callback(null, isMatch);
  });
};

export default mongoose.model<IUser>('User', UserSchema);