const nextConfig = {
  webpack: (config) => {
    // Enable WebAssembly support
    config.experiments = { asyncWebAssembly: true, layers: true };

    // Fix for ONNX runtime
    config.resolve.alias['onnxruntime-node'] = false;

    // Add alias for @
    config.resolve.alias['@'] = path.resolve(__dirname);

    return config;
  },
};

module.exports = nextConfig;