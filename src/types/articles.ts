import { ObjectId } from "mongodb";

export type Article = {
  _id: ObjectId;
  id: number;
  img: string;
  title: string;
  text: string;
  createdAt: string;
}