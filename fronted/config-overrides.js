const path = require('path');

module.exports = function override(config, env) {

    // 获取rules
  const rules = config.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;

  // 查找scss对应的rule
  rules.forEach(rule => {
    if (String(rule.test) === String(/\.module\.(scss|sass)$/)) {
      // 修改css-loader的options
      const cssLoader = rule.use.find(use => use.loader && use.loader.includes('css-loader'));
      if (cssLoader) {
        cssLoader.options.modules = {
          ...cssLoader.options.modules,
          localIdentName: '[sha1:hash:hex:8]', // 这里定义了生成的哈希类名格式
        };
      }
    }
  });

    // 设置路径别名
    config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, 'src/')
    };

    return config;
};
