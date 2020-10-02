import React, {useEffect,useState} from 'react';
import Papa from 'papaparse'
import Mapbox from './Mapbox'
const pathToCsv=process.env.PUBLIC_URL+'/employment-by-state.csv'

const App = ()=>{

  const [data,setData] = useState(null)
  useEffect(()=>{
    Papa.parse(pathToCsv,{
      header:true,
      download: true,
      skipEmptyLines: true,
      complete: (result)=>setData(result.data)
    })
  },[])

  return(
    <>
    <h1>Hello World</h1> 
    {data?<Mapbox data={data}/>:''}
    </>
  )
}

export default App;
