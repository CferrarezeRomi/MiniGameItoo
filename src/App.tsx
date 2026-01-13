import React from 'react'
import SecretNumberGenerator from './components/Game'

function App(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col 
    items-center justify-center gap-6 bg-zinc-200 p-2"
    >
      <div className="flex gap-4">
        <SecretNumberGenerator />
      </div>
    </div>
  )
}

export default App