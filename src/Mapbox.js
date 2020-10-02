import React, {useState,useEffect,useRef} from 'react'
import mapboxgl from 'mapbox-gl'
import states from './us-states.json'
import population from './us-populations.json'

import "mapbox-gl/dist/mapbox-gl.css";
require('dotenv').config()

const styles = {
    width: "100vw",
    height: "calc(100vh - 80px)",
    position: "absolute"
  };

const Mapbox = (props) => {
    const mapContainer = useRef(null)

    const r = 152
    const g = 251
    const b = 152

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
      
    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    const getColors=(max)=>{
        const arr=[]
        for(let i=0;i<=max;i+=7){
            arr.push([i,rgbToHex(parseInt(i/7 * r/10), parseInt(i/7 * g/10), parseInt(i/7 * b/10))])
        }
        console.log(arr)
        return arr
    }



    useEffect(()=>{
        
        addDataToSource()

        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
        const map = new mapboxgl.Map(
            {
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [-95, 40.72],
                zoom: 3
            }
        )
        map.on("load", () => {
            map.resize();
            map.addSource(`states`,{
                type:'geojson',
                data:states
            })
            map.addLayer({
                id:`states-fill`,
                'type': 'fill',
                'source': `states`,
                'paint': {
                    'fill-color': {
                        property: 'change',
                        stops: getColors(76)
                    },
                    'fill-opacity': 0.6
                }
            })
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const addDataToSource= () => states.features.forEach(state=>{
            const name = state.properties.name
            const stateData = props.data.find(item=>(item.State===name))
            if(stateData){
                let changeInt = parseInt(stateData.Change)
                if(changeInt<0) changeInt*=-1
                state.properties.change = parseInt(changeInt/(population[name]/1000))
                console.log(state.properties.change)
            }
        })
    

    return(
        <div ref={el=>mapContainer.current=el} style={styles} />
    )
}

export default Mapbox