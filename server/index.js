const fs = require("fs");
const csvParser = require("csv-parser");

const result = [];

fs.createReadStream("./data/sevastopol.csv")
  .pipe(csvParser())
  .on("data", (data) => {
    const geoJSON = sqlMultipolygonToGeoJSON(data.geometry);
    // console.log(geoJSON);

    result.length < 10 && result.push(geoJSON);
  })
  .on("end", () => {
    console.log(result);
  });

function sqlMultipolygonToGeoJSON(sqlMultipolygon) {
  // Parse the SQL multipolygon into an array of polygons
  const polygons = sqlMultipolygon.slice(10, -2).split(")),((");

  // Convert each polygon into an array of coordinates
  const coordinates = polygons.map((polygon) => {
    return polygon.split(",").map((point) => {
      return point.trim().split(" ").map(parseFloat);
    });
  });

  // Convert the coordinates to a GeoJSON MultiPolygon object
  const multiPolygon = {
    type: "MultiPolygon",
    coordinates: [coordinates],
  };

  // Convert the GeoJSON MultiPolygon to a GeoJSON Feature object
  const feature = {
    type: "Feature",
    geometry: multiPolygon,
    properties: {},
  };

  // Convert the GeoJSON Feature to a GeoJSON FeatureCollection object
  const featureCollection = {
    type: "FeatureCollection",
    features: [feature],
  };

  return featureCollection;
}
