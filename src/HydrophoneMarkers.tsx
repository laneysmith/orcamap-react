import React, { FC, useState, MouseEventHandler } from 'react'
import { Marker, Popup } from 'react-mapbox-gl'
import { HYDROPHONE_LOCATIONS } from './constants'

interface Hydrophone {
  id: number
  name: string
  description?: string
  coordinates: number[]
}

const HydrophoneMarkers: FC = () => {
  const [activeHydrophone, setActiveHydrophone] = useState<Hydrophone | null>(
    null,
  )
  const onMouseEnter = (hydrophone: Hydrophone): void =>
    setActiveHydrophone(hydrophone)
  const onMouseLeave: MouseEventHandler<HTMLElement> = (): void =>
    setActiveHydrophone(null)

  let popup
  if (activeHydrophone) {
    const { coordinates, name, description } = activeHydrophone
    popup = (
      <Popup
        coordinates={coordinates}
        style={{ maxWidth: 250, zIndex: 100 }}
        offset={10}
      >
        <strong>{name} Hydrophone</strong>
        <br />
        {description}
      </Popup>
    )
  }

  return (
    <>
      {HYDROPHONE_LOCATIONS.map((hydrophone: Hydrophone) => {
        const { id, coordinates } = hydrophone
        return (
          <Marker
            key={id}
            coordinates={coordinates}
            anchor="center"
            onMouseEnter={() => onMouseEnter(hydrophone)}
            onMouseLeave={onMouseLeave}
          >
            <div className="hydrophone-marker-container">
              <div className="hydrophone-marker" />
            </div>
          </Marker>
        )
      })}
      {popup}
    </>
  )
}

export default HydrophoneMarkers
