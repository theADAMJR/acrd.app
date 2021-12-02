module.exports = {
  plugins: [
    { plugin: require('craco-plugin-scoped-css') },
    { plugin: require('@dvhb/craco-extend-scope'), options: { path: 'static' } },
  ],
}