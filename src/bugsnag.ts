import bugsnag from "@bugsnag/js"
import BugsnagPluginExpress from "@bugsnag/plugin-express"
const unhandledRejection = require("unhandled-rejection")

import configs from "./utils/configs"

const appVersion = require("../package.json").version

export default bugsnag.createClient({
	apiKey: configs.bugSnagKey,
	plugins: [BugsnagPluginExpress],
	appVersion,
})

let rejectionEmitter = unhandledRejection({ timeout: 20 })

rejectionEmitter.on("unhandledRejection", (error: any) => {
	console.error("bugsnag/unhandledRejection", error)
	bugsnag.notify(error)
})
