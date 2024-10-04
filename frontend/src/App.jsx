
import {useEffect, useState} from 'react'

import Footer from './components/Footer';

const App=()=> {
  {/* Hooks (useState(),useEffect(),useRef(),useReducer(),useMemo() ...) */}
  const [name,setName]=useState('');
  const [date,setDate]=useState(null);
  useEffect(()=>{
    giveDate();
  },[]);

  {/* Arrow Function */}
  const giveDate=()=>{
    setDate(new Date().getFullYear());
  }

  if(!name){
    setName('TeamWork');
  }
  return (
    <div className='bg-slate-400 max-w-[768px] ml-[30%]'>
      <h1 className='lg:text-red-600 text-center font-bold text-5xl mt-[90px] sm:text-blue-700 border-4 rounded-lg'>Date {date} </h1>
      <p className='text-white text-center text-3xl p-5'>welcome {name}</p>
      <Footer/>
    </div>
  )
}

export default App
