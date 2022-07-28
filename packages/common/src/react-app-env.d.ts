/// <reference types="react-scripts" />
import { CSSProp } from 'styled-components'

declare module 'react' {
  interface Attributes {
    css?: CSSProp<MyTheme>
  }
}
