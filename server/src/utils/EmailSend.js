import NodeMailer from "nodemailer";
import config from "../../config/config.js";

const Transport = NodeMailer.createTransport({
  host: config.googleSMTP.host,
  port: config.googleSMTP.port,
  secure: true,
  auth: {
    user: config.googleSMTP.user,
    pass: config.googleSMTP.pass,
  },
});

const GenerateMailTemplate = (to, otp) => {
  return {
    form: "thelosser321@gmail.com",
    to: to,
    subject: "otp",
    html: `<div style="background-color: #16171c; color: white; padding: 2rem; border-radius: 0.5rem; max-width: 28rem; margin: 0 auto; font-family: 'Inter', sans-serif; --font-sans-serif: 'Inter';">
  <div style="margin-bottom: 1rem;">
    <div style="text-align: center;">
      <h1 style="font-size: 1rem; color:cyan;">gigaSync</h1>
      <h1 style="font-size: 1.5rem; font-weight: bold;">Forgot Password</h1>
      <p style="color: #b3b8c6;">Use the following one-time password to reset your account password.</p>
    </div>
    <div style="background-color: #262730; border:#464b5e66 solid 1px; padding: 1rem; border-radius: 0.5rem; text-align: center;">
      <h2 style="font-size: 2.25rem; font-weight: bold;">${otp}</h2>
    </div>
    <div style="text-align: center;">
      <p style="color: #b3b8c6;">
        This OTP will expire in 10 minutes. If you did not request a password reset, please ignore this email.
      </p>
    </div>
  </div>
</div>

  `,
  };
};
export const sendGoogleMail = (sendToMail, otp) => {
  const body = GenerateMailTemplate(sendToMail, otp);
  Transport.sendMail(body, (error, info) => {
    if (error) {
      return error;
    }
    return info;
  });
};
