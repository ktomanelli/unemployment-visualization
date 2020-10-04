import React, {useState,useEffect,useRef} from 'react'
import mapboxgl from 'mapbox-gl'
import states from './us-states.json'
import population from './us-populations.json'

import "mapbox-gl/dist/mapbox-gl.css";
require('dotenv').config()

const styles = {
    width: "100vw",
    height: "calc(100vh - 80px)",
    position: "relative"
  };
const dataStyles={
    position: 'absolute',
    zIndex:'1',
    bottom: '',
    right: '0',
    width:'30%',
    display:'block',
    color:'white',
    backgroundColor:'#282a36',
}

const Mapbox = (props) => {
    const [mouseOverState,setMouseOverState] = useState({
        name:'',
        population:'',
        change:'',
        changePerPop:'',
    })
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
                        property: 'changePerPop',
                        stops: getColors(76)
                    },
                    'fill-opacity': 0.6
                }
            })
        });

        map.on('mousemove','states-fill',e=>{
            map.getCanvas().style.cursor = 'pointer';
            const name = e.features[0].properties.name
            setMouseOverState({
                name,
                population:population[name],
                change:e.features[0].properties.change,
                changePerPop:e.features[0].properties.changePerPop,
            })  
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const addDataToSource= () => states.features.forEach(state=>{
            const name = state.properties.name
            const stateData = props.data.find(item=>(item.State===name))
            if(stateData){
                state.properties.change = stateData.Change
                let changeInt = parseInt(stateData.Change)
                if(changeInt<0) changeInt*=-1
                state.properties.changePerPop = parseInt(changeInt/(population[name]/1000))
            }
        })
    

    return(
        <div>
            <div className='stateData' style={dataStyles}>
                <h4>{mouseOverState.name}</h4>
                <p>State Population:<br/>{mouseOverState.population}</p>
                <p>Change in State Unemployment:<br/>{mouseOverState.change}</p>  
                <p>Change in State Unemployment Per 1000 People:<br/>{mouseOverState.changePerPop*-1}</p>  
            </div>
            <div ref={el=>mapContainer.current=el} style={styles} />
        </div>
    )
}

export default Mapbox