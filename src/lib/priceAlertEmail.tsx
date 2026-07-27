import { Resend } from "resend";
import dotenv from "dotenv";
import PriceAlertEmail from "@/app/(catalog)/catalog/[category]/(product)/[id]/_components/PriceAlertEmail";

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

export const sendPriceAlertEmail = async ({
  to,
  productId,
  productTitle,
  oldPrice,
  newPrice,
  unsubscribeToken,
}: {
  to: string;
  productTitle: string;
  oldPrice: number;
  newPrice: number;
  productId: string;
  unsubscribeToken: string;
}): Promise<boolean> => {
  try {
    const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/product/${productId}?desc=${encodeURIComponent(productTitle)}`;
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/price-alerts/unsubscribe?token=${unsubscribeToken}&email=${encodeURIComponent(to)}`;

    const { error } = await resend.emails.send({
      from: "Северяночка <onboarding@resend.dev>",
      to,
      subject: `💰 Цена на "${productTitle}" снизилась!`,
      react: PriceAlertEmail({
        productTitle,
        oldPrice,
        newPrice,
        productUrl,
        unsubscribeUrl,
      }),
    });

    if (error) {
      console.error("Ошибка при отправке письма: ", error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Ошибка при отправке письма: ", e);
    return false;
  }
};
