import developConfig from './develop'
import productionConfig from './production'

const isDevelop = process.env.NODE_ENV !== 'production'

const config = isDevelop ? developConfig : productionConfig

export default config
