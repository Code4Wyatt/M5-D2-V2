import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_KEY)

export const sendRegistrationEmail = async recipientAddress => {
    const email = {
        to: recipientAddress,
        from: process.env.SENDER_EMAIL,
        subject: "Thank you for registering!",
        text: "Welcome to our blog site, time to get blogging!",
        html: "Welcome to our blog site, time to get <strong>blogging!</strong>",
    }

    await sgMail.send(email)
}