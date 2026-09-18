import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 3001,
  mongoUri: process.env.MONGODB_URI || "",
  mongoDbName: process.env.MONGODB_DB_NAME || "endurodrift",
  sessionSecret: process.env.SESSION_SECRET || "",
  nodeEnv: process.env.NODE_ENV || "development",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:4321",
  resendApiKey: process.env.RESEND_API_KEY || "",
  contactEmailTo: process.env.CONTACT_EMAIL_TO || "endurodriftbosnien@gmail.com",
  contactEmailFrom: process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev",
  oldMongoDbName: process.env.OLD_MONGODB_DB_NAME || "",
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY || "",
};
