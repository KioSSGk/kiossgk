/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['universalkiossgk.s3.ap-northeast-1.amazonaws.com'],
  },
};

export default nextConfig;
