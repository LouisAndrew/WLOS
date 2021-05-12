import 'tailwindcss/tailwind.css'
import 'reactjs-popup/dist/index.css';
import '../styles/globals.css'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
export const decorators = [
  (Story) => (
    <div className="w-full bg-bg-gray relative">
      <Story />
    </div>
  )
]
