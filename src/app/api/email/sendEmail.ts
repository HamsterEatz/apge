import { getServerSession } from "next-auth";
import getNodeMailer from "./getNodeMailer";
import { authOptions } from "../auth/[...nextauth]";

export default async function sendEmail(subject: string, html: any) {
    try {
        const session = await getServerSession(authOptions);
        const receiverEmail = session?.user?.email;
        if (!session || !receiverEmail) {
            throw new Error('Unable to get receiver email');
        }

        const { transporter, senderEmail } = getNodeMailer();
        await transporter.sendMail({
            from: `APGE <${senderEmail}>`,
            to: receiverEmail,
            subject,
            html: await html(false)
        });
        return transporter.sendMail({
            from: `APGE <${senderEmail}>`,
            to: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID,
            subject,
            html: await html(true)
        });
    } catch (e: any) {
        console.error(e.message)
        return;
    }
}