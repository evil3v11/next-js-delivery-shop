import { Resend } from "resend";
import dotenv from "dotenv";
import PriceAlertEmail from "@/app/(catalog)/catalog/[category]/(product)/[slug]/_components/PriceAlertEmail";
import { baseUrl } from "@/utils/baseUrl";

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
    const productUrl = `${baseUrl}/catalog/product/${productId}?desc=${encodeURIComponent(productTitle)}`;
    const unsubscribeUrl = `${baseUrl}/api/price-alerts/unsubscribe?token=${unsubscribeToken}&email=${encodeURIComponent(to)}`;

    const { error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
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
