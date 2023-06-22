import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import { ConnectOptions } from 'mongoose';

dotenv.config();

export const checkingEnvVariables = () => {
  const envSchema = Joi.object()
    .keys({
      APP_NAME: Joi.string().default('Login-Service'),
      NODE_ENV: Joi.string().valid('prod', 'dev', 'test').required(),
      PORT: Joi.number().default(3000),
      MONGODB_URL: Joi.string().required().description('Mongo DB url'),
      JWT_SECRET: Joi.string().required().description('JWT secret key'),
      JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    })
    .unknown();

  const { error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
};

export const config = {
  appName: process.env.APP_NAME,
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoose: {
    url: process.env.MONGODB_URL + (process.env.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
  },
};
