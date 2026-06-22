import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  saltRounds: number;

  jwtSecret: string;

  postgresUser: string;
  postgresPassword: string;
  postgresPort: number;
  postgresHost: string;
  postgresDatabase: string;
  postgresMaxConnections: number;
}
const config: Config = {
  port: Number(process.env.PORT) || 3000,
  saltRounds: Number(process.env.SALT_ROUNDS) || 10,

  jwtSecret: String(process.env.JWT_SECRET),
  postgresUser: process.env.POSTGRES_USER || 'postgres',
  postgresPassword: process.env.POSTGRES_PASSWORD || 'password',
  postgresPort: Number(process.env.POSTGRES_PORT) || 5432,
  postgresHost: process.env.POSTGRES_HOST || "localhost",
  postgresDatabase: process.env.POSTGRES_DATABASE || "blog",
  postgresMaxConnections: Number(process.env.POSTGRES_MAX_CONNECTIONS) || 20,

}

export default config;
