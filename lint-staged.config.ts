import type { Configuration } from 'lint-staged';

const SCRIPTS = '*.{js,ts}';
const OTHER = `!(${SCRIPTS})`;

const tsc = () => 'pnpm check:types';
const oxfmt = 'pnpm oxfmt --no-error-on-unmatched-pattern';
const oxlint = 'pnpm oxlint --fix';

export default {
  [`${SCRIPTS}|SCRIPTS`]: [oxfmt, oxlint],
  [`${SCRIPTS}|TYPES`]: tsc,
  [OTHER]: oxfmt,
} satisfies Configuration;
