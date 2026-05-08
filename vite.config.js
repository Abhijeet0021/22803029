import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-oxc' // Change this line

export default defineConfig({
  plugins: [react()],
})