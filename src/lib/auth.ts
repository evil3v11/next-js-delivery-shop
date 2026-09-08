import { MongoClient } from "mongodb";
import { Resend } from "resend";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { CONFIG } from "../../config/config";
import { admin, phoneNumber } from "better-auth/plugins";
import { deleteUserAvatarFromGridFS } from "@/utils/deleteUserAvatar";

import VerifyEmail from "@/app/(auth)/(registration)/_components/VerifyEmail";
import PasswordResetEmail from "@/app/(auth)/(update-pass)/_components/PasswordResetEmail";
import EmailChangeVerification from "@/app/(user-profle)/_components/EmailChangeVerification";
import DeleteVerify from "@/app/(auth)/(registration)/_components/DeleteVerify";

const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
const db = client.db("delivery-shop");
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  session: {
    expiresIn: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    expiresIn: 86400,
    autoSignInAfterVerification: false,
    resetPasswordTokenExpiresIn: 86400,
    sendResetPassword: async ({ user, url }) => {
      void resend.emails.send({
        from: "Северяночка <onboarding@resend.dev>",
        to: user.email,
        subject: "Сброс пароля для Северяночки",
        react: PasswordResetEmail({ username: user.name, resetUrl: url }),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void resend.emails.send({
        from: "Северяночка <onboarding@resend.dev>",
        to: user.email,
        subject: "Подтвердите ваш e-mail",
        react: VerifyEmail({ username: user.name, verifyUrl: url }),
      });
    },
  },
  plugins: [
    phoneNumber({
      sendOTP: ({ phoneNumber, code }) => {
        console.log(`[DEBUG] Отправка OTP: ${code} для ${phoneNumber}`);
      },
      // sendOTP: async ({ phoneNumber, code }) => {
      //   try {
      //     const response = await fetch(
      //       `https://sms.ru/sms/send?api_id=${process.env.SMS_API_ID}&to=${phoneNumber}&msg=Ваш код подтверждения от "Северяночки": ${code}&json=1`,
      //     );
      //     const result = await response.json();
      //     if (result.status !== "OK") throw new Error(result.status || "Ошибка отправки SMS");
      //   } catch (e) {
      //     console.error("Ошибка отправки SMS: ", e);
      //     throw e;
      //   }
      // },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}${CONFIG.TEMP_EMAIL_DOMAIN}`;
        },
        getTempName: (phoneNumber) => {
          return phoneNumber;
        },
      },
      allowedAttempts: 3,
      otpLength: 4,
      expiresIn: 300,
      requireVerification: true,
    }),
    admin(),
  ],
  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await resend.emails.send({
          from: "Северяночка <onboard@resend.dev>",
          to: user.email,
          subject: "Удаление аккаунта в Северяночке",
          react: DeleteVerify({ username: user.name, verifyUrl: url }),
        });
      },
      afterDelete: async (user) => await deleteUserAvatarFromGridFS(user.id),
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        await resend.emails.send({
          from: "Северяночка <onboarding@resend.dev>",
          to: user.email,
          subject: "Подтверждение смены email в Северяночке",
          react: EmailChangeVerification({
            username: user.name,
            currentEmail: user.email,
            newEmail,
            verificationUrl: url,
          }),
        });
      },
    },
    additionalFields: {
      phoneNumber: {
        type: "string",
        input: true,
        required: true,
      },
      lastName: {
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
      role: {
        type: "string",
        input: false,
        required: false,
        default: "user",
      },
    },
  },
});
