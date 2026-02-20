import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Setup paths for ES modules
const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(__dirname, '..')

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Check your .env file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Read and parse GeoJSON
const geojsonPath = resolve(PROJECT_ROOT, 'osm_data.geojson')
console.log(`Reading GeoJSON from: ${geojsonPath}`)

const rawData = readFileSync(geojsonPath, 'utf-8')
const geojson = JSON.parse(rawData)

console.log(`Found ${geojson.features.length} features in GeoJSON`)

// Transform GeoJSON features to Supabase rows
function transformFeature(feature) {
  const { geometry, properties } = feature

  // Skip if no valid coordinates
  if (!geometry || !geometry.coordinates || geometry.coordinates.length < 2) {
    return null
  }

  const [lng, lat] = geometry.coordinates // GeoJSON uses [lon, lat] order

  // Skip invalid coordinates
  if (typeof lng !== 'number' || typeof lat !== 'number') {
    return null
  }

  // Build name
  const name = properties.name || `Unnamed ${properties.shop || 'Shop'}`

  // Build address
  const street = properties['addr:street'] || ''
  const houseNumber = properties['addr:housenumber'] || ''
  const address = [street, houseNumber].filter(Boolean).join(' ').trim() || null

  // Build description with opening hours
  const openingHours = properties.opening_hours || 'Unknown'
  const description = `Hours: ${openingHours}`

  return {
    name,
    category: properties.shop || 'other',
    address,
    lat,
    lng,
    is_open: true,
    description,
    sunday_hours: openingHours,
  }
}

// Transform all features
const shops = geojson.features
  .map(transformFeature)
  .filter((shop) => shop !== null)

console.log(`Transformed ${shops.length} valid shops`)

// Insert in batches
const BATCH_SIZE = 50

async function importShops() {
  const totalBatches = Math.ceil(shops.length / BATCH_SIZE)

  console.log(`Starting import: ${shops.length} shops in ${totalBatches} batches`)

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < shops.length; i += BATCH_SIZE) {
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1
    const batch = shops.slice(i, i + BATCH_SIZE)

    const { data, error } = await supabase.from('shops').insert(batch).select()

    if (error) {
      console.error(`Batch ${batchNumber}/${totalBatches} failed:`, error.message)
      errorCount += batch.length
    } else {
      console.log(`Imported batch ${batchNumber}/${totalBatches} (${data.length} rows)`)
      successCount += data.length
    }
  }

  console.log('\n--- Import Complete ---')
  console.log(`Success: ${successCount} shops`)
  console.log(`Errors: ${errorCount} shops`)
}

importShops().catch((err) => {
  console.error('Import failed:', err)
  process.exit(1)
})
