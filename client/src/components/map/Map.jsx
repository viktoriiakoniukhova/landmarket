import React from "react";
import styles from "./Map.module.scss";
import { v4 as uuidv4 } from "uuid";

import {
  GoogleMap,
  Polygon,
  MarkerF,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import { useState, useEffect, useMemo } from "react";

const google = window.google;
const coordsKyiv = { lat: 50.453899, lng: 30.555633 };

export default function Map({ landData }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  // const [currentLocation, setCurrentLocation] = useState(coordsKyiv);
  // const center = useMemo(() => currentLocation, [currentLocation]);
  const [center, setCenter] = useState(coordsKyiv);
  const [zoom, setZoom] = useState(10);

  // useEffect(() => {
  // getGeolocationJS();
  // fetchLandsData();
  // }, []);

  // const getGeolocationJS = () => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const lat = +position.coords.latitude;
  //     const lng = +position.coords.longitude;
  //     setCurrentLocation({ lat, lng });
  //   });
  // };

  //Land info
  // const [landData, setLandData] = React.useState([]);

  // function fetchLandsData() {
  //   fetch("http://localhost:5000/api/land/land-test-all")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setLandData(data);
  //     });
  // }

  const [polygons, setPolygons] = React.useState([]);
  const [coordsAnno, setCoordsAnno] = React.useState({});
  // const [squareAnno, setSquareAnno] = React.useState({});

  function createPolygons() {
    const polygons = [];
    landData.forEach((objMain) => {
      const { cadnum, category } = objMain;
      const obj = objMain.geometry.features[0];
      if (obj.geometry.type === "MultiPolygon") {
        const multipolygons = obj.geometry.coordinates.map((coords) =>
          coords.map((polygonCoords) =>
            polygonCoords.map((coord) => ({
              lat: coord[1],
              lng: coord[0],
            }))
          )
        );
        multipolygons.forEach((paths) => {
          if (landData.length === 1) {
            setCoordsAnno(paths[0][0]);
            const area = objMain.area;
            if (area <= 1) setZoom(17);
            else if (area > 1 && area <= 25) setZoom(16);
            else if (area > 25 && area < 100) setZoom(15);
            else if (area > 100 && area < 200) setZoom(13);
          }
          polygons.push(
            <Polygon
              key={uuidv4()}
              paths={paths}
              onClick={() => handlePolygonClick(cadnum, category, paths[0][0])}
            ></Polygon>
          );
        });
      }
    });
    setPolygons(polygons);
  }

  //Single polygon

  //Show info window on polygon click
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState({
    cadnum: "",
    category: "",
    infoWindowCoords: {},
  });

  const handlePolygonClick = (cadnum, category, coords) => {
    setInfoWindowData({
      cadnum,
      category,
      coords,
    });
    setIsOpen(true);
  };

  useEffect(() => {
    if (landData.length !== 0 && landData[0].cadnum.length !== 0) {
      createPolygons();
    }
  }, [landData]);

  useEffect(() => {
    if (landData.length === 1) {
      setCenter(coordsAnno);
      // setCenter({ lat: +coordsAnno.lat, lng: +coordsAnno.lng });
    }
  }, [coordsAnno]);
  // console.log(landData);
  // //Show info window on marker click
  // const [mapRef, setMapRef] = useState();
  // const [isOpen, setIsOpen] = useState(false);
  // const [infoWindowData, setInfoWindowData] = useState();

  // const handleMarkerClick = (id, lat, lng, address) => {
  //   mapRef?.panTo({ lat, lng });
  //   setInfoWindowData({ id, address });
  //   setIsOpen(true);
  // };
  // console.log(coordsAnno, center);
  return (
    <>
      {!isLoaded ? (
        <h1>Map is loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName={styles.mapContainer}
          zoom={zoom}
          center={center}
        >
          {polygons}
          {isOpen && (
            <InfoWindow
              position={infoWindowData.coords}
              onCloseClick={() => {
                setIsOpen(false);
              }}
              content={<h3>{infoWindowData.cadnum}</h3>}
            >
              <div>
                <h3>{infoWindowData.cadnum}</h3>
              </div>
            </InfoWindow>
          )}
          {/* <MarkerF
            className="marker"
            position={currentLocation}
            onClick={() => {
              handleMarkerClick(
                1,
                currentLocation.lat,
                currentLocation.lng,
                "Info address"
              );
            }}
          >
            {isOpen && infoWindowData?.id === 1 && (
              <InfoWindow
                onCloseClick={() => {
                  setIsOpen(false);
                }}
                content={<h3>{infoWindowData.address}</h3>}
              >
                <div>
                  <h3>{infoWindowData.address}</h3>
                </div>
              </InfoWindow>
            )}
          </MarkerF> */}
        </GoogleMap>
      )}
    </>
  );
}
