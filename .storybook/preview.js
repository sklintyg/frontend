import 'inera-core-css/src/icons/inera/fontello/style.scss'
import 'inera-core-css/src/themes/inera-master.scss'
import '../apps/webcert/src/index.css'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
