import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Map.module.css'

function Map() {
  const navigateTo = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  return (
    <div className={styles.mapContainer} onClick={() => navigateTo('form')}>
      <h1>Map</h1>
      <p>Position: {lat}, {lng}</p>
      <button onClick={() => setSearchParams({lat: 22, lng: 23})}>Change</button>
    </div>
  )
}

export default Map
