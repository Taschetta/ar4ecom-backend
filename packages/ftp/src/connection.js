
export default async ({ Client }) => {
  // Env vars
  const FTP_HOST = process.env.FTP_HOST
  const FTP_USERNAME = process.env.FTP_USERNAME
  const FTP_PASSWORD = process.env.FTP_PASSWORD

  // Instance
  const sftp = new Client()

  // Connection
  await sftp.connect({
    host: FTP_HOST,
    username: FTP_USERNAME,
    password: FTP_PASSWORD,
  })

  return sftp
}
