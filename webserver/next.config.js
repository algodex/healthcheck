/** @type {import('next').NextConfig} */

const username = 'admin';
const password = 'LampLampAAr5$';
let bufferObj = Buffer.from(username + ':' + password, "utf8");
let base64String = bufferObj.toString("base64");

console.log(base64String);
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/data',
        headers: [
          {
            key: 'Authorization',
            value: 'Basic ' + base64String
          },
        ],
      },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/data',
          destination: 'http://ec2-15-223-77-132.ca-central-1.compute.amazonaws.com:5984/server_status/_design/server_status/_view/server_status?reduce=true&group=true&skip=0&limit=21',
        },
      ]
    }
  },
}

module.exports = nextConfig;

