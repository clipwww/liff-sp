module.exports = {
  extends: '@antfu',
  rules: {
    'no-console': 'off',
    'no-irregular-whitespace': 'off',
    'brace-style': 'off',
    'curly': ['warn', 'all'],
    'vue/max-attributes-per-line': ['warn', {
      singleline: 3,
      multiline: 1,
    }],
    'vue/custom-event-name-casing': 'off', // * for vue2 workaround
    '@typescript-eslint/brace-style': ['warn', '1tbs'],
    '@typescript-eslint/ban-ts-comment': ['warn', {
      'ts-expect-error': 'allow-with-description',
      'ts-ignore': 'allow-with-description',
      'ts-nocheck': 'allow-with-description',
      'ts-check': 'allow-with-description',
    }],
    '@typescript-eslint/no-namespace': 'off', // * for legacy code workaround
    'vue/no-deprecated-filter': 'off', // * for vue2 workaround (vue3 才棄用)
    'vue/no-deprecated-slot-attribute': 'off', // * for vue2 workaround (vue3 才棄用)
    'vue/no-deprecated-v-bind-sync': 'off', // * for vue2 (vue3 才棄用)
    'vue/no-deprecated-v-on-native-modifier': 'off', // * for vue2 workaround (vue3 才棄用)
    'vue/no-deprecated-slot-scope-attribute': 'off', // * slot-scope 已經用很久了 慢慢改吧 🫠
    'vue/no-v-for-template-key-on-child': 'off', // * for vue2 workaround (vue3 才能夠在 template 上寫 key)
    'vue/no-deprecated-router-link-tag-prop': 'off', // * for vue2 (vue3 才棄用)
  },
}
