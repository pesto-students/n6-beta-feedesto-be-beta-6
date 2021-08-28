import { apiAuthLogin } from "./auth/login/apiAuthLogin"
import { apiAuthRegisterOrganization } from "./auth/register/apiAuthRegisterOrganization"
import { apiAuthRegisterUser } from "./auth/register/apiAuthRegisterUser"
import { apiOrganizationAdd } from "./organization/apiOrganizationAdd"
import { apiOrganizationList } from "./organization/apiOrganizationList"

export default [
	apiOrganizationList,
	apiOrganizationAdd,
	apiAuthLogin,
	apiAuthRegisterUser,
	apiAuthRegisterOrganization,
]
