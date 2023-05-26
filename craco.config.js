import { userAgent } from './src/utils/tools'
const cracoSassResourcesLoader = require('craco-sass-resources-loader')
const path = require('path')
module.export = {
	plugins: [
		{
			plugin: cracoSassResourcesLoader,
			options: {
				resources: userAgent() === 'PC' ? path.resolve(__dirname, 'src/assets/style/_theme.scss') : path.resolve(__dirname, 'src/wap/assets/style/index.scss')
			}
		}
	]
}
