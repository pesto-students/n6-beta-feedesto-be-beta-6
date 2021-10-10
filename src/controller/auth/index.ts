import configs from "../../utils/configs"

export enum AuthRole {
	ORGANIZATION = "organization",
	USER = "user",
}

export const JWT_SECRET = configs.server.name
export const JWT_ISSUER = "FEEDESTO_GATEWAY"
