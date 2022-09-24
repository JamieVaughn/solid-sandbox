import { Component, createSignal } from 'solid-js'

const indexedDB =
  window?.indexedDB || window?.mozIndexedDB || window?.webkitIndexedDB || window?.msIndexedDB || window?.shimIndexedDB

const request = indexedDB.open('carsdb', 1)

request.onerror = (e) => {
  console.log('there was an error', e)
}

request.onupgradeneeded = () => {
  const db = request.result
  const store = db.createObjectStore('cars', { keyPath: 'id' })
  store.createIndex('cars_color', ['color'], { unique: false })
  store.createIndex('color_and_make', ['color', 'make'], { unique: false })
}

request.onsuccess = () => {
  const db = request.result
  const transaction = db.transaction('cars', 'readwrite')
  const store = transaction.objectStore('cars')
  const colorIndex = store.index('cars_color')
  const makeColorIndex = store.index('color_and_make')
  store.put({ id: 1, color: 'red', make: 'toyota' })
  store.put({ id: 2, color: 'red', make: 'kia' })
  store.put({ id: 3, color: 'blue', make: 'honda' })
  store.put({ id: 4, color: 'silver', make: 'toyota' })
  const idQuery = store.get(4)
  const colorQuery = colorIndex.getAll(['red'])
  const makeColorQuery = makeColorIndex.getAll(['blue', 'honda'])

  idQuery.onsuccess = () => {
    console.log('colorQuery', idQuery.result)
  }
  colorQuery.onsuccess = () => {
    console.log('colorQuery', colorQuery.result)
  }
  makeColorQuery.onsuccess = () => {
    console.log('makeColorQuery', makeColorQuery.result)
  }

  transaction.oncomplete = () => db.close()
}

const indexdb: Component<{}> = (props) => {
  return (
    <div class='p-4'>
      <h1>Indexdb</h1>
    </div>
  )
}

export default indexdb
