export const getAvatarByGender = (gender?: string) =>
  gender === "female"
    ? "/images/graphics/defaultAvatars/female.png"
    : "/images/graphics/defaultAvatars/male.png";
