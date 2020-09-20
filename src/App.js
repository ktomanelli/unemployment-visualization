import React, {useEffect} from 'react';
import Papa from 'papaparse'
import Mapbox from './Mapbox'
const pathToCsv=process.env.PUBLIC_URL+'/employment-by-state.csv'

const App = ()=>{

  useEffect(()=>{
    Papa.parse(pathToCsv,{
      header:true,
      download: true,
      skipEmptyLines: true,
      complete: (result)=>console.log(result.data)
    })
  },[])

  return(
    <>
    <h1>Hello World</h1>  
    <Mapbox/>
    </>
  )
}

export default App;
