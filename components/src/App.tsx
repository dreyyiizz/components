import React, { useState } from 'react'
import Button from './components/Button'
import RedirectButton from './components/RedirectButton'

const App: React.FC = () => {
  const [count, setCount] = useState<number>(0)

  const green = count > 0 ? Math.min(count * 2.55, 255) : 0
  const red = count < 0 ? Math.min(Math.abs(count) * 2.55, 255) : 0
  const backgroundColor = `rgb(${red}, ${green}, 0)`

  return (
    <div 
      className="w-full min-h-screen flex flex-col justify-center items-center transition-colors duration-500" 
      style={{ backgroundColor }}
    >
      <div className="flex flex-row gap-10">
        <Button 
          onClick={() => setCount(
            (prev) => (prev < 100 ? prev + 5 : prev)
          )}
        >
          Increment!
        </Button>

        <Button 
          onClick={() => setCount(
            (prev) => (prev > -100 ? prev - 5 : prev)
          )}
        >
          Decrement!
        </Button>
      </div>
      
      <div className="mt-10 p-4 rounded-md bg-black text-white transition-colors duration-500">
        <h1>
          Background Volume : {count}%
        </h1>
      </div>

      <div className='mt-10 flex flex-col gap-4 text-center'>
        <RedirectButton 
        url="https://youtu.be/dQw4w9WgXcQ?si=HmdPgdzvpitXP0fS"
        >
          Check this link!
        </RedirectButton>

        <RedirectButton 
        url="https://youtu.be/NhHb9usKy6Q?si=0Kis8giWj1lloLFF"
        >
          Check this link!
        </RedirectButton>

        <RedirectButton 
        url="https://youtu.be/QwLvrnlfdNo?si=qrDW6ylbR93JU5sq"
        >
          Check this link!
        </RedirectButton>
      </div>

    </div>
  )
}

export default App
