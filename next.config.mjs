/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // ✅ GitHub Pages static export
  output: "export",

  // ✅ Change this to your GitHub repo name
  basePath: "/iris-student-support",
  assetPrefix: "/iris-student-support/",
}

export default nextConfig
