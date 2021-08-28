import { apiOrganizationAdd } from './organization/apiOrganizationAdd'
import { apiOrganizationList } from './organization/apiOrganizationList'
import { apiUserLogin } from './auth/login/apiAuthLogin'

export default [apiOrganizationList, apiOrganizationAdd, apiUserLogin]
