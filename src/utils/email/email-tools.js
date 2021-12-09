import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_KEY)

export const sendRegistrationEmail = async recipientAddress => {
    const email = {
        to: recipientAddress,
        from: process.env.SENDER_EMAIL,
        subject: "Thank you for posting!",
        text: "Welcome to our blog site, thank you for making your first post!",
        html: "Welcome to our blog site, thank you for making your first post",
    }

    await sgMail.send(email)
}