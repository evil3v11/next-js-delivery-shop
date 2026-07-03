import VerifyEmail from "@/app/(auth)/(registration)/_components/VerifyEmail";
import { betterAuth, string } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { Resend } from "resend";

const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
const db = client.db("delivery-shop");
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    expiresIn: 86400,
    autoSignInAfterVerification: false,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      void resend.emails.send({
        from: "Северяночка <onboarding@resend.dev>",
        to: user.email,
        subject: "Подтвердите ваш e-mail",
        react: VerifyEmail({ username: user.name, verifyUrl: url }),
      });
    },
  },
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        input: true,
        required: true,
      },
      birthdayDate: {
        type: "date",
        input: true,
        required: true,
      },
      region: {
        type: "string",
        input: true,
        required: true,
      },
      location: {
        type: "string",
        input: true,
        required: true,
      },
      gender: {
        type: "string",
        input: true,
        required: true,
      },
      card: {
        type: "string",
        input: true,
        required: false,
      },
      hasNoCard: {
        type: "boolean",
        input: true,
        required: false,
      },
    },
  },
});
