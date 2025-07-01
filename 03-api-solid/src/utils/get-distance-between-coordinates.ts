export interface Coordinate {
  latitude: number
  longitude: number
}

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
) {
  const EARTH_RADIUS_KM = 6371

  const dLat = degToRad(to.latitude - from.latitude)
  const dLon = degToRad(to.longitude - from.longitude)

  const fromLat = degToRad(from.latitude)
  const toLat = degToRad(to.latitude)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_KM * c
}

function degToRad(deg: number) {
  return (deg * Math.PI) / 180
}
