import React, { FC, useEffect, useState, MouseEventHandler } from 'react'
import config from './config'
import { Layer, Feature, Image, Popup } from 'react-mapbox-gl'
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
  GoogleSpreadsheetRow,
} from 'google-spreadsheet'
// import { thingy } from './icons'
// import microphone from './microphone.svg'

const doc = new GoogleSpreadsheet(config.spreadsheetId)
doc.useApiKey(config.apiKey)

// const image: HTMLImageElement = new Image(20, 20)
// image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(thingy)
// image.src = './images/microphone.svg'

interface EventDetail {
  user: string
  type: string
  latitude: number
  longitude: number
  timestamp: number
}

const EventsLayer: FC = () => {
  const [events, setEvents] = useState<GoogleSpreadsheetRow[]>([])
  const [focusedEvent, setFocusedEvent] = useState<EventDetail | null>(null)

  const onMouseEnter: MouseEventHandler<HTMLElement> = (event: any): void => {
    if (event?.feature?.properties) {
      setFocusedEvent(event.feature.properties)
    }
  }
  const onMouseLeave: MouseEventHandler<HTMLElement> = (): void =>
    setFocusedEvent(null)

  useEffect(function effectFunction() {
    async function loadSpreadsheet() {
      await doc.loadInfo()
      const sheet: GoogleSpreadsheetWorksheet = doc.sheetsByIndex[0]
      const rows: GoogleSpreadsheetRow[] = await sheet.getRows()
      setEvents(rows)
    }
    loadSpreadsheet()
  }, [])

  let popup
  if (focusedEvent) {
    const { user, type, timestamp, longitude, latitude } = focusedEvent
    popup = (
      <Popup
        coordinates={[longitude, latitude]}
        style={{ maxWidth: 300, zIndex: 100 }}
        offset={15}
      >
        <strong>{type}</strong> shared by {user}
        <br />
        {timestamp}
      </Popup>
    )
  }

  return (
    <>
      <Image
        id="visual"
        url="./images/binoculars.png"
        // options={{ sdf: true }}
        // width={16}
        // height={16}
      />
      <Layer
        id="event-layer"
        type="symbol"
        // the feature's 'type' will be mapped to an Image id
        layout={{ 'icon-image': ['get', 'type'] }}
      >
        {events.map((event) => {
          const {
            _rowNumber,
            user,
            type,
            latitude,
            longitude,
            timestamp,
          } = event
          return (
            <Feature
              key={_rowNumber}
              coordinates={[longitude, latitude]}
              properties={{ type, timestamp, longitude, latitude, user }}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          )
        })}
      </Layer>
      {popup}
    </>
  )
}

export default EventsLayer
