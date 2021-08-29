import { apiAnswerAdd } from "./answer/apiAnswerAdd"
import { apiAnswerDelete } from "./answer/apiAnswerDelete"
import { apiAnswerList } from "./answer/apiAnswerList"
import { apiAuthLogin } from "./auth/login/apiAuthLogin"
import { apiAuthRegisterOrganization } from "./auth/register/apiAuthRegisterOrganization"
import { apiAuthRegisterUser } from "./auth/register/apiAuthRegisterUser"
import { apiCommentAdd } from "./comment/apiCommentAdd"
import { apiCommentDelete } from "./comment/apiCommentDelete"
import { apiCommentList } from "./comment/apiCommentList"
import { apiDiscussionAdd } from "./discussion/apiDiscussionAdd"
import { apiDiscussionDelete } from "./discussion/apiDiscussionDelete"
import { apiDiscussionList } from "./discussion/apiDiscussionList"
import { apiDiscussionUpdate } from "./discussion/apiDiscussionUpdate"
import { apiOrganizationList } from "./organization/apiOrganizationList"
import { apiOrganizationUpdate } from "./organization/apiOrganizationUpdate"
import { apiUserDelete } from "./user/apiUserDelete"
import { apiUserList } from "./user/apiUserList"
import { apiUserUpdate } from "./user/apiUserUpdate"
import { apiUserVerify } from "./user/apiUserVerify"

export default [
	apiOrganizationList,
	apiOrganizationUpdate,
	apiAuthLogin,
	apiAuthRegisterUser,
	apiAuthRegisterOrganization,
	apiUserList,
	apiUserUpdate,
	apiUserVerify,
	apiUserDelete,
	apiDiscussionList,
	apiDiscussionAdd,
	apiDiscussionUpdate,
	apiDiscussionDelete,
	apiAnswerAdd,
	apiAnswerList,
	apiAnswerDelete,
	apiCommentAdd,
	apiCommentList,
	apiCommentDelete,
]
