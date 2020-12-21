import React, { FC, useEffect, useState, MouseEventHandler } from 'react'
import config from './config'
import { Layer, Feature, Image as AddImage, Popup } from 'react-mapbox-gl'
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
  GoogleSpreadsheetRow,
} from 'google-spreadsheet'
import { microphone } from './icons'
import svgAsImg from './utils/svgAsImg'

const doc = new GoogleSpreadsheet(config.spreadsheetId)
doc.useApiKey(config.apiKey)

enum EventType {
  VISUAL = 'visual',
}
interface EventDetail {
  id: number
  user: string
  type: EventType
  latitude: number
  longitude: number
  timestamp: number
}

const EventsLayer: FC = () => {
  const [events, setEvents] = useState<GoogleSpreadsheetRow[]>([])
  // const [events, setEvents] = useState<any[]>([])
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
      // const rows = [
      //   {
      //     _rowNumber: 1,
      //     user: 'someone',
      //     type: EventType.VISUAL,
      //     longitude: -122.4862825,
      //     latitude: 47.51248061,
      //     timestamp: 123456,
      //   },
      // ]
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

  // const visualIcon = svgAsImg(microphone)

  return (
    <>
      {/* <AddImage
        id={EventType.VISUAL}
        src={visualIcon.src}
        width={16}
        height={16}
        // options={{ sdf: true }}
      /> */}
      <Layer
        id="event-layer"
        type="symbol"
        layout={{ 'icon-image': 'marker-15' }}
        // layout={{ 'icon-image': ['get', 'type'] }}
        // images={[EventType.VISUAL, visualIcon]}
      >
        {events.map((event) => {
          const {
            _rowNumber: id,
            user,
            type,
            latitude,
            longitude,
            timestamp,
          } = event
          return (
            <Feature
              key={id}
              coordinates={[longitude, latitude]}
              properties={{ id, type, timestamp, longitude, latitude, user }}
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
