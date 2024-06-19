const dotEnv = require("dotenv");

if (process.env.NODE_ENV == "dev") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}
