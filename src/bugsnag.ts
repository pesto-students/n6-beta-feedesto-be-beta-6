import bugsnag from "@bugsnag/js"
import BugsnagPluginExpress from "@bugsnag/plugin-express"
const unhandledRejection = require("unhandled-rejection")

import configs from "./utils/configs"

import packageFile from "../package.json"

export default bugsnag.createClient({
	apiKey: configs.bugSnagKey,
	plugins: [BugsnagPluginExpress],
	appVersion: packageFile.version,
})

let rejectionEmitter = unhandledRejection({ timeout: 20 })

rejectionEmitter.on("unhandledRejection", (error: any) => {
	console.error("bugsnag/unhandledRejection", error)
	bugsnag.notify(error)
})
