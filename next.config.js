const nextConfig = {
  webpack: (config) => {
    // Enable WebAssembly support
    config.experiments = { asyncWebAssembly: true, layers: true };

    // Fix for ONNX runtime
    config.resolve.alias['onnxruntime-node'] = false;

    // Fix for ONNX runtime
    config.resolve.alias['onnxruntime-node'] = path.resolve(__dirname, 'node_modules/onnxruntime-node');

    return config;
  },
};

module.exports = nextConfig;