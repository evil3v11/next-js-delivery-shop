import { getDB } from "./api-routes";
import { GridFSBucket, ObjectId } from "mongodb";

export const deleteUserAvatarFromGridFS = async (userId: string) => {
  try {
    const db = await getDB();
    const bucket = new GridFSBucket(db, { bucketName: "avatars" });
    const userObjectId = new ObjectId(userId);

    const avatarFile = await db
      .collection("avatars.files")
      .findOne({ "metadata.userId": userObjectId });

    if (avatarFile) {
      await bucket.delete(avatarFile._id);
      console.log(`Аватар пользователя ${userId} успешно удален`);
    }
  } catch (e) {
    console.error("Ошибка удаления аватара: ", e);
  }
};
