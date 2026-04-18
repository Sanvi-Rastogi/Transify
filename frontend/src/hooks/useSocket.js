import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export function useSocket() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [locationUpdates, setLocationUpdates] = useState({});
  const [occupancyUpdates, setOccupancyUpdates] = useState({});
  const [scheduleUpdates, setScheduleUpdates] = useState([]);

  useEffect(() => {
    socketRef.current = io("http://localhost:5001");

    socketRef.current.on("connect", () => setConnected(true));
    socketRef.current.on("disconnect", () => setConnected(false));

    socketRef.current.on("vehicle-location-update", (data) => {
      setLocationUpdates((prev) => ({ ...prev, [data.vehicleId]: data }));
    });

    socketRef.current.on("occupancy-update", (data) => {
      setOccupancyUpdates((prev) => ({ ...prev, [data.vehicleId]: data }));
    });

    socketRef.current.on("schedule-update", (data) => {
      setScheduleUpdates((prev) => [data, ...prev].slice(0, 20));
    });

    return () => socketRef.current.disconnect();
  }, []);

  return { connected, locationUpdates, occupancyUpdates, scheduleUpdates };
}
