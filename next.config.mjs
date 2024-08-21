/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'universalkiossgk.s3.ap-northeast-1.amazonaws.com',
        pathname: '/**'
      },
    ],
  },
};

export default nextConfig;
