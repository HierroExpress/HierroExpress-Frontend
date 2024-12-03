"use client";

import { Map, Marker } from "@vis.gl/react-google-maps";
import { useState } from "react";
const INITIAL_CAMERA: MapCameraProps = {
  center: { lat: -34.9011, lng: -56.1645 },
  zoom: 14,
};

const MapFerreria = () => {
  const [cameraProps, setCameraProps] =
    useState<MapCameraProps>(INITIAL_CAMERA);

  const handleCameraChange = (ev: MapCameraChangedEvent) => {
    console.log(ev.detail);
    setCameraProps(ev.detail);
  };
    return (
      
    <Map
      onCameraChanged={handleCameraChange}
      {...cameraProps}
      style={{
        width: "100%",
        height: "400px",
      }}>
      <Marker position={{ lat: -34.9011, lng: 56.1645 }} />
    </Map>
  );
};

export default MapFerreria;
