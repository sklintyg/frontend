import { FloatingDelayGroup } from '@frontend/components'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import './index.css'
import store from './store/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <FloatingDelayGroup delay={200}>
        <App />
      </FloatingDelayGroup>
    </Provider>
  </StrictMode>
)
