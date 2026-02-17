import antfu from '@antfu/eslint-config'

export default antfu(
  {
    gitignore: true,
    ignores: [
      'build/**',
      'config/**',
      'dist/**',
      'test/unit/coverage/**',
      '**/*.d.ts',
    ],
  },
  {
    rules: {
      'no-console': 'off',
      'no-alert': 'off',
      'no-restricted-globals': 'off',
      'no-undef': 'off',
      'no-irregular-whitespace': 'off',
      'style/max-statements-per-line': 'off',
      'unused-imports/no-unused-vars': 'off',
      'unicorn/no-new-array': 'off',
      'curly': ['warn', 'all'],
      'vue/max-attributes-per-line': ['warn', {
        singleline: 3,
        multiline: 1,
      }],
      'vue/custom-event-name-casing': 'off',
      'ts/ban-ts-comment': ['warn', {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
        'ts-check': 'allow-with-description',
      }],
      'ts/no-namespace': 'off',
      'vue/no-deprecated-filter': 'off',
      'vue/no-deprecated-slot-attribute': 'off',
      'vue/no-deprecated-v-bind-sync': 'off',
      'vue/no-deprecated-v-on-native-modifier': 'off',
      'vue/no-deprecated-slot-scope-attribute': 'off',
      'vue/no-v-for-template-key-on-child': 'off',
      'vue/no-deprecated-router-link-tag-prop': 'off',
    },
  },
)
