const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mui/material/utils': '@mui/material/utils',
    };
    return config;
  },
};

module.exports = nextConfig;