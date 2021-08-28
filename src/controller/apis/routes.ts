import { apiAuthLogin } from "./auth/login/apiAuthLogin"
import { apiAuthRegisterOrganization } from "./auth/register/apiAuthRegisterOrganization"
import { apiAuthRegisterUser } from "./auth/register/apiAuthRegisterUser"
import { apiDiscussionAdd } from "./discussion/apiDiscussionAdd"
import { apiDiscussionList } from "./discussion/apiDiscussionList"
import { apiOrganizationAdd } from "./organization/apiOrganizationAdd"
import { apiOrganizationList } from "./organization/apiOrganizationList"
import { apiUserDelete } from "./user/apiUserDelete"
import { apiUserUpdate } from "./user/apiUserUpdate"

export default [
	apiOrganizationList,
	apiOrganizationAdd,
	apiAuthLogin,
	apiAuthRegisterUser,
	apiAuthRegisterOrganization,
	apiUserUpdate,
	apiUserDelete,
	apiDiscussionList,
	apiDiscussionAdd,
]
