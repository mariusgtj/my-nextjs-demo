/**
 * @type {import('next').NextConfig}
*/
const nextConfig = {
    /* config options here */
    env: {
        dbUser: 'dbUser',
        dbPassword: 'dbUser2002',
        dbName: 'meetups',
        // customKey: 'my-value',
      },
}
  
module.exports = nextConfig