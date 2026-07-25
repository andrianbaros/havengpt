import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Dev origin whitelist (local network development)
  allowedDevOrigins: ['10.110.90.23'],

  // Ensure headers are preserved during streaming responses
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Accel-Buffering', value: 'no' },
        ],
      },
    ];
  },
};

export default nextConfig;
