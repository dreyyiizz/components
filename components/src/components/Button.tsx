import React from 'react'

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button 
      onClick={onClick} 
      className='bg-black rounded-md text-white p-4 cursor-pointer'
    >
      {children}
    </button>
  )
}

export default Button
