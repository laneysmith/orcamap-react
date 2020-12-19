import React, { FC } from 'react'
import Map from './Map'
// import Marker from './Marker'
import EventsLayer from './EventsLayer'
import HydrophoneMarkers from './HydrophoneMarkers'

const App: FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Map
          style="mapbox://styles/mapbox/light-v9"
          containerStyle={{
            height: '100vh',
            width: '100vw',
          }}
          zoom={[6.5]}
          center={[-123.35, 48.41]}
        >
          {/* <Marker /> */}
          <EventsLayer />
          <HydrophoneMarkers />
        </Map>
      </header>
    </div>
  )
}

export default App
