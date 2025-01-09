const commitlintConfig = { 
  // extends: ['@commitlint/config-conventional'],
  extends: [],
  rules: {
    'header-min-length': [2, 'always', 20],
    'header-case-start-capital': [2, 'always'],
    'header-end-period': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'header-case-start-capital': ({ raw }: { raw: string }) => {
          return [
            /^[A-Z]/.test(raw),
            'Commit message must start with a capital letter',
          ];
        },
        'header-end-period': ({ header }: { header: string }) => {
          return [/\.$/.test(header), 'Commit message must end with a period'];
        },
      },
    },
  ],
};

export default commitlintConfig;
