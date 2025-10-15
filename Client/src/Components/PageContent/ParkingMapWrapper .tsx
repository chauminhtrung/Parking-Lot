import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ParkingMap from "./ParkingMap";
import ParkingMapRedirect from "./ParkingMapRedirect";
import floorApi  from "../../Api/parkingFloorApi";

interface Props {
  user: any;
  setUser: any;
}

const ParkingMapWrapper: React.FC<Props> = ({ user, setUser }) => {
  const { lotId, floor } = useParams<{ lotId: string; floor?: string }>();
  const [hasFloor, setHasFloor] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFloors = async () => {
      if (!lotId || lotId === "none") {
        setHasFloor(false);
        return;
      }
      try {
        const data = await floorApi.getFloorsByLotId(Number(lotId));
        setHasFloor(data && data.length > 0);
      } catch {
        setHasFloor(false);
      }
    };
    checkFloors();
  }, [lotId]);

  if (hasFloor === null) return null; // loading

  // Nếu không có floor hoặc lotId là none → hiển thị ParkingMapRedirect
  if (!hasFloor) return <ParkingMapRedirect user={user} setUser={setUser} />;

  // Nếu có floor mà floor param chưa có → redirect về /parkingmap/1
  if (hasFloor && !floor) return <Navigate to="1" replace />;

  // Nếu có floor → hiển thị ParkingMap
  return <ParkingMap user={user} setUser={setUser} />;
};

export default ParkingMapWrapper;
