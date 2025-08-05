// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from '@sentry/nestjs';
import { EnvKeys } from './shared/constants/env.const';

Sentry.init({
  dsn: process.env[EnvKeys.SENTRY_DSN],

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
