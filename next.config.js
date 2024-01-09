/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/game/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store',
                    },
                    {
                        key: 'x-another-custom-header',
                        value: 'my other custom header value',
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig
