import Client from 'ssh2-sftp-client'
import makeConnection from './src/connection.js'

export const connection = await makeConnection({ Client })
