import { RequestMethod, WebApi } from "@hkbyte/webapi"
import configs from "../../../utils/configs"

export const apiMiscBugSnagKeyGet = new WebApi({
	endpoint: "/misc/bugSnagKey",
	method: RequestMethod.GET,
	handler: async () => {
		return { BUGSNAG_KEY: configs.bugSnagKey }
	},
})
