import React, { FC, useState, MouseEventHandler } from 'react'
import { Layer, Feature, Popup } from 'react-mapbox-gl'
import { HYDROPHONE_LOCATIONS } from './constants'

const HydrophoneLayer: FC = () => {
  const [activeHydrophone, setActiveHydrophone] = useState<Record<
    string,
    any
  > | null>(null)
  const onMouseEnterHydrophone = (event: any): void => {
    const {
      features,
      lngLat: { lng, lat },
    } = event
    const feature = features?.[0]
    if (feature) {
      setActiveHydrophone({ ...feature, coordinates: [lng, lat] })
    }
  }
  const onMouseLeaveHydrophone: MouseEventHandler<HTMLElement> = (): void =>
    setActiveHydrophone(null)

  let popup
  if (activeHydrophone) {
    const {
      coordinates,
      properties: { title, description },
    } = activeHydrophone
    popup = (
      <Popup coordinates={coordinates} style={{ maxWidth: 250 }}>
        <strong>{title} Hydrophone</strong>
        <br />
        {description}
      </Popup>
    )
  }

  const image = new Image(512, 512)
  image.src =
    'data:image/svg+xml;charset=utf-8;base64,' + btoa('./images/binoculars.png')
  // image.width = 512
  // image.height = 512
  const images = ['microphone', image]

  return (
    <>
      {popup}
      <Layer
        id="hydrophone-layer"
        type="symbol"
        layout={{ 'icon-image': 'microphone' }}
        images={images}
      >
        {HYDROPHONE_LOCATIONS.map((hydrophone) => {
          // aliasing "name" to "title" because for some reason having a "name" key
          // on the properties object prevents the features from rendering
          const { id, coordinates, name: title, description } = hydrophone
          return (
            <Feature
              key={id}
              coordinates={coordinates}
              properties={{ title, description }}
              onMouseEnter={onMouseEnterHydrophone}
              onMouseLeave={onMouseLeaveHydrophone}
            />
          )
        })}
      </Layer>
    </>
  )
}

export default HydrophoneLayer
