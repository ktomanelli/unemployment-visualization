import React, {useState,useEffect,useRef} from 'react'
import mapboxgl from 'mapbox-gl'
import states from './us-states.json'

import "mapbox-gl/dist/mapbox-gl.css";
require('dotenv').config()

const styles = {
    width: "100vw",
    height: "calc(100vh - 80px)",
    position: "absolute"
  };

const Mapbox = (props) => {
    const mapContainer = useRef(null)
    const [map, setMap] = useState(null);
    
    useEffect(()=>{
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
        const initializeMap=({setMap,mapContainer})=>{
            const map = new mapboxgl.Map(
                {
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [-74, 40.72],
                    zoom: 10.3
                }
            )
        }
        if(!map) initializeMap({setMap,mapContainer})
    }, [map])

    return(
        <div ref={el=>mapContainer.current=el} style={styles} />
    )
}

export default Mapbox