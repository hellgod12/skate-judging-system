export interface HeatAssignment {
  id: string;
  heat_id: string;
  rider_id: string;
  registration_id: string;
  start_order?: number;
  lane?: number;
  created_at: string;
}

export interface CreateHeatAssignmentData {
  heat_id: string;
  rider_id: string;
  registration_id: string;
  start_order?: number;
  lane?: number;
}

export interface UpdateHeatAssignmentData {
  start_order?: number;
  lane?: number;
}
