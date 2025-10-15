export interface ParkingStats {
  filled: number
  empty: number
  total?: number
}

export interface FloorData {
  [zone: string]: ParkingStats
}

export interface ParkingData {
  [floor: string]: FloorData
}

export type VehicleType = "car" | "motorcycle" | "bicycle"
export type ZoneType = "Car Zone" | "Motorcycle Zone" | "Bicycle Zone"
