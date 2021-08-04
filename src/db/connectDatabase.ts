import { connect } from "mongoose";

export const connectDatabase = async () => {
  await connect(process.env.MONGODB_URI as string, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
  });

  console.log("Database Connected!");
}