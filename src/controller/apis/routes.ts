import { apiAnswerAdd } from "./answer/apiAnswerAdd"
import { apiAnswerDelete } from "./answer/apiAnswerDelete"
import { apiAnswerAddDownvote } from "./answer/apiAnswerDownvoteAdd"
import { apiAnswerList } from "./answer/apiAnswerList"
import { apiAnswerAddUpvote } from "./answer/apiAnswerUpvoteAdd"
import { apiAuthLogin } from "./auth/login/apiAuthLogin"
import { apiAuthRegisterOrganization } from "./auth/register/apiAuthRegisterOrganization"
import { apiAuthRegisterUser } from "./auth/register/apiAuthRegisterUser"
import { apiCommentAdd } from "./comment/apiCommentAdd"
import { apiCommentDelete } from "./comment/apiCommentDelete"
import { apiCommentAddDownvote } from "./comment/apiCommentDownvoteAdd"
import { apiCommentList } from "./comment/apiCommentList"
import { apiCommentAddUpvote } from "./comment/apiCommentUpvoteAdd"
import { apiDiscussionAdd } from "./discussion/apiDiscussionAdd"
import { apiDiscussionDelete } from "./discussion/apiDiscussionDelete"
import { apiDiscussionList } from "./discussion/apiDiscussionList"
import { apiDiscussionScoreList } from "./discussion/apiDiscussionScore"
import { apiDiscussionUpdate } from "./discussion/apiDiscussionUpdate"
import { apiMiscBugSnagKeyGet } from "./misc/apiBugSnagKeyGet"
import { apiOrganizationAdd } from "./organization/apiOrganizationAdd"
import { apiOrganizationList } from "./organization/apiOrganizationList"
import { apiOrganizationUpdate } from "./organization/apiOrganizationUpdate"
import { apiUserDelete } from "./user/apiUserDelete"
import { apiUserGet } from "./user/apiUserGet"
import { apiUserList } from "./user/apiUserList"
import { apiUserUpdate } from "./user/apiUserUpdate"
import { apiUserVerify } from "./user/apiUserVerify"

export default [
	apiOrganizationAdd,
	apiOrganizationList,
	apiOrganizationUpdate,
	apiAuthLogin,
	apiAuthRegisterUser,
	apiAuthRegisterOrganization,
	apiUserList,
	apiUserUpdate,
	apiUserVerify,
	apiUserDelete,
	apiUserGet,
	apiDiscussionList,
	apiDiscussionAdd,
	apiDiscussionUpdate,
	apiDiscussionDelete,
	apiDiscussionScoreList,
	apiAnswerAdd,
	apiAnswerList,
	apiAnswerDelete,
	apiAnswerAddUpvote,
	apiAnswerAddDownvote,
	apiCommentAdd,
	apiCommentList,
	apiCommentDelete,
	apiCommentAddUpvote,
	apiCommentAddDownvote,
	apiMiscBugSnagKeyGet,
]
