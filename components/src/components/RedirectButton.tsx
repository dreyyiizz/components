import React from 'react'

interface RedirectButtonProps {
  url: string
  children?: React.ReactNode
}

const RedirectButton: React.FC<RedirectButtonProps> = ({ url, children }) => {
  return (
    <a 
    href={ url } 
    target="_blank" 
    rel="noopener noreferrer">
      <button className="bg-black text-white px-6 py-2 rounded-md cursor-pointer">
        { children }
      </button>
    </a>
  )
}

export default RedirectButton
