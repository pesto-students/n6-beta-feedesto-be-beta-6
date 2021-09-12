const dir = process.argv.length > 2 ? process.argv[2] + '/**' : '**'
const spec = `test/${dir}/*.test.ts`

module.exports = {
	timeout: 20000,
	exit: true,
	extension: 'ts',
	recursive: true,
	require: 'ts-node/register',
	spec,
}
