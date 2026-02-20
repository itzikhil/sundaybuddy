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
const geojsonPath = resolve(PROJECT_ROOT, 'family_data.geojson')
console.log(`Reading GeoJSON from: ${geojsonPath}`)

const rawData = readFileSync(geojsonPath, 'utf-8')
const geojson = JSON.parse(rawData)

console.log(`Found ${geojson.features.length} features in GeoJSON`)

/**
 * Determine the category based on GeoJSON properties
 */
function getCategory(properties) {
  if (properties.leisure === 'playground') {
    return 'Playground'
  }
  if (properties.tourism === 'zoo') {
    return 'Petting Zoo'
  }
  if (properties.tourism === 'museum') {
    return 'Museum'
  }
  if (properties.sport === 'trampoline' || properties.sport === 'climbing') {
    return 'Indoor Play'
  }
  return 'Family Attraction'
}

/**
 * Transform a GeoJSON feature to a Supabase row
 */
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

  // Determine category
  const category = getCategory(properties)

  // Build name
  const name = properties.name || `Unnamed ${category}`

  // Build address
  const street = properties['addr:street'] || ''
  const houseNumber = properties['addr:housenumber'] || ''
  const address = [street, houseNumber].filter(Boolean).join(' ').trim() || 'Berlin'

  // Build description
  const baseDescription = properties.description || ''
  const description = `Perfect for families! ${baseDescription}`.trim()

  // Opening hours
  const sundayHours = properties.opening_hours || 'Daylight hours'

  return {
    name,
    category,
    address,
    lat,
    lng,
    is_open: true,
    sunday_hours: sundayHours,
    description,
  }
}

// Transform all features
const familyPlaces = geojson.features
  .map(transformFeature)
  .filter((place) => place !== null)

console.log(`Transformed ${familyPlaces.length} valid family attractions`)

// Insert in batches
const BATCH_SIZE = 50

async function importFamilyData() {
  const totalBatches = Math.ceil(familyPlaces.length / BATCH_SIZE)

  console.log(`Starting import: ${familyPlaces.length} places in ${totalBatches} batches`)

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < familyPlaces.length; i += BATCH_SIZE) {
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1
    const batch = familyPlaces.slice(i, i + BATCH_SIZE)

    const { data, error } = await supabase.from('shops').insert(batch).select()

    if (error) {
      console.error(`Family batch ${batchNumber}/${totalBatches} failed:`, error.message)
      errorCount += batch.length
    } else {
      console.log(`Imported family batch ${batchNumber}/${totalBatches} (${data.length} rows)`)
      successCount += data.length
    }
  }

  console.log('\n--- Family Data Import Complete ---')
  console.log(`Success: ${successCount} places`)
  console.log(`Errors: ${errorCount} places`)

  // Show category breakdown
  const categoryCounts = {}
  familyPlaces.forEach((place) => {
    categoryCounts[place.category] = (categoryCounts[place.category] || 0) + 1
  })
  console.log('\nCategory breakdown:')
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`)
  })
}

importFamilyData().catch((err) => {
  console.error('Import failed:', err)
  process.exit(1)
})
