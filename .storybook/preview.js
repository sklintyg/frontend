import 'inera-core-css/src/icons/inera/fontello/style.scss'
import 'inera-core-css/src/themes/inera-master.scss'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
