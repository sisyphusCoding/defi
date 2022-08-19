
import { useEffect, useState } from 'react'
import { BsSunFill, BsMoonFill } from 'react-icons/bs'
import {motion} from 'framer-motion'


const ThemeSwitch = () => {


  const [dark, setDark] = useState<boolean>(false)

  useEffect(()=>{


  },[])

  useEffect(()=>{
  if(dark){
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
  }else{
    document.documentElement.classList.remove('dark')
    localStorage.theme = 'light'
  }
  },[dark])


  return (
    <motion.section
      onClick={()=>{setDark(!dark)}}
      style={{transformStyle:'preserve-3d'}}
      initial={{rotateX:0}}
      animate={{rotateX: dark? 180:0}}
      transition={{type:'spring',damping:10}}
     className='
      cursor-pointer
      h-11 w-14 
      bg-zinc-50 
      dark:bg-zinc-700
      rounded-xl
      flex flex-col items-center justify-center
      md:text-[3.2vmin]
      text-2xl
      relative'
     >
      <div 
        style={{transform:'rotateX(0deg) translate3d(0,0,.8rem)'}}
       className='absolute'
        >
        <BsSunFill />
      </div>
      <div
        style={{transform:'rotateX(180deg) translate3d(0,0,.8rem)'}}
       className='absolute'
       >
        <BsMoonFill />
      </div>
    </motion.section>
  )
}



export default ThemeSwitch
