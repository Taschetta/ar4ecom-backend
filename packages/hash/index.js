import bcrypt from 'bcrypt'
import useHash from './src/hash.js'

const rounds = process.env.HASH_ROUNDS

export const hash = useHash({ bcrypt }, { rounds })

export default hash
