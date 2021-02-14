// window.onload = () => {
//   const button = document.querySelector('button[data-action="change"]');
//   button.innerHTML = "?";

//   const palces = staticLoadPlaces();
//   renderPlaces(palces);
// };

// function staticLoadPlaces() {
//   return [
//     {
//       name: "Pokèmon",
//       location: {
//         lat: 35.792643,
//         lng: 51.500012,
//       },
//     },
//   ];
// }

// var models = [
//   {
//     url: "./assets/magnemite/scene.gltf",
//     scale: "0.1 0.1 0.1",
//     info: "Magnemite, Lv. 5, HP 10/10",
//     rotation: "0 180 0",
//   },
//   {
//     url: "./assets/articuno/scene.gltf",
//     scale: "0.2 0.2 0.2",
//     rotation: "0 180 0",
//     info: "Articuno, Lv. 80, HP 100/100",
//   },
//   {
//     url: "./assets/dragonite/scene.gltf",
//     scale: "0.08 0.08 0.08",
//     rotation: "0 180 0",
//     info: "Dragonite, Lv. 99, HP 150/150",
//   },
// ];

// var modelIndex = 0;
// var setModel = (model, entity) => {
//   if (model.sacle) {
//     entity.setAttribute("scale", model.scale);
//   }

//   if (model.rotation) {
//     entity.setAttribute("rotation", model.rotation);
//   }

//   if (model.position) {
//     entity.setAttribute("position", model.position);
//   }

//   entity.setAttribute("gltf-model", model.url);

//   const div = document.querySelector(".instructions");
//   div.innerHTML = model.info;
// };

// function renderPlaces(places) {
//   let scene = document.querySelector("a-scene");

//   places.forEach((element) => {
//     let latitude = element.location.lat;
//     let longitutide = element.location.lng;

//     let model = document.createElement("a-entity");
//     model.setAttribute(
//       "gps-entity-place",
//       `latitude: ${latitude}; longitude: ${longitutide}`
//     );

//     setModel(models[modelIndex], model);
//     model.setAttribute("animation-mixer", "");

//     document
//       .querySelector('button[data-action="change')
//       .addEventListener("click", () => {
//         var entity = document.querySelector("[gps-entity-place]");
//         modelIndex++;
//         let newIndex = modelIndex % models.length;
//         setModel(models[newIndex], entity);
//       });

//     scene.appendChild(model);
//   });
// }

// var loadPlaces = (position) => {
//   const params = {
//     radius: 300, // search places not farther than this value (in meters)
//     clientId: "F5A12URCJNBMUF4T1KG321GHMS5SAW5ZBEYUVSVXK31PT2WA",
//     clientSecret: "NZAFMSKXS1BBFGSFSQ4M25QTLFU1SWL1ICGE3MT2AI5KEGUL",
//     version: "20300101", // foursquare versioning, required but unuseful for this demo
//   };

//   const corsProxy = "https://cors-anywhere.herokuapp.com/";

//   // Foursquare API (limit param: number of maximum places to fetch)
//   const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
//       &ll=${position.latitude},${position.longitude}
//       &radius=${params.radius}
//       &client_id=${params.clientId}
//       &client_secret=${params.clientSecret}
//       &limit=30
//       &v=${params.version}`;

//   return fetch(endpoint)
//     .then((res) => {
//       return res.json().then((resp) => {
//         return resp.response.venues;
//       });
//     })
//     .catch((err) => {
//       console.error("Error with places API", err);
//     });
// };

// window.onload = () => {
//   const scene = document.querySelector("a-scene");

//   return navigator.geolocation.getCurrentPosition(
//     (position) => {
//       console.log("posisions", position);
//       loadPlaces(position.coords).then((places) => {
//         places.forEach((place) => {
//           const latitude = place.location.lat;
//           const longitude = place.location.lng;

//           // add place name
//           const placeText = document.createElement("a-link");
//           placeText.setAttribute(
//             "gps-entity-place",
//             `latitude: ${latitude}; longitude: ${longitude};`
//           );
//           placeText.setAttribute("title", place.name);
//           placeText.setAttribute("scale", "15 15 15");

//           placeText.addEventListener("loaded", () => {
//             window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
//           });

//           scene.appendChild(placeText);
//         });
//       });
//     },
//     (err) => console.error("Error in retrieving position", err),
//     {
//       enableHighAccuracy: true,
//       maximumAge: 0,
//       timeout: 27000,
//     }
//   );
// };

window.onload = () => {
  const cameraPos = document
    .querySelector("a-camera")
    .getAttribute("gps-camera");
  const parrentElement = document.querySelector("a-scene");
  // origin
  const origin = {
    lang: cameraPos.simulateLongitude,
    lat: cameraPos.simulateLatitude,
  };

  // console.log(origin);
  // parrentElement.append();
  makePosesWithDistanceAndDegrees(origin, parrentElement)
  // makePoses(origin, parrentElement);
  // const aTexes = document.querySelectorAll("a-text");
};

const Direction = {
  1: {
    name: "upper lang",
    color: "blue",
  },
  2: {
    name: "upper lat",
    color: "red",
  },
  3: {
    name: "upper lat and lang",
    color: "black",
  },
  4: {
    name: "downer lat and lang",
    color: "gray",
  },
  5: {
    name: "downer long",
    color: "green",
  },
  6: {
    name: "downer lat",
    color: "#4A4238",
  },
  7: {
    name: "upper lang downer lat",
    color: "brown",
  },
  8: {
    name: "downer long upper lat",
    color: "orange",
  },
};

function makePosesWithDistanceAndDegrees(originPoint, parrentElement) {
  // 2 meters
  const distance = 2.0;
  for (let i = 0; i <= 360; i += 30) {
    const [lat, long] = calculateTheSecondPoint(
      originPoint.lat,
      originPoint.lang,
      distance,
      i
    );
    AddPoints(lat, long, "blue", parrentElement);
  }
}

function AddPoints(lat, long, color, parrentElement) {
  const placeText = document.createElement("a-box");
  placeText.setAttribute(
    "gps-entity-place",
    `latitude: ${lat}; longitude: ${long};`
  );
  // console.log(`latitude: ${point.lat}; longitude: ${point.lang};`);
  placeText.setAttribute("value", `lat:${lat}; \n long: ${long} \n`);
  console.log(
    `lat:${point.lat}; \n long: ${point.lang} \n dir=${Direction[j].name}`
  );
  placeText.setAttribute("scale", "10 10 10");
  placeText.setAttribute("position", {
    x: 0,
    y: 0,
    y: 0,
  });
  placeText.setAttribute("material", `color:${color}`);
  placeText.addEventListener("loaded", () => {
    window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
  });
  parrentElement.appendChild(placeText);
}

function makePoses(origin, parrentElement) {
  let count = 0;

  for (let i = 0; i < 1 && count < 20; count++, i += 0.0008) {
    const points = [
      {
        lang: origin.lang + i,
        lat: origin.lat,
      },
      {
        lang: origin.lang,
        lat: origin.lat + i,
      },
      {
        lang: origin.lang + i,
        lat: origin.lat + i,
      },
      {
        lang: origin.lang - i,
        lat: origin.lat - i,
      },
      {
        lang: origin.lang - i,
        lat: origin.lat,
      },
      {
        lang: origin.lang,
        lat: origin.lat - i,
      },
      {
        lang: origin.lang + i,
        lat: origin.lat - i,
      },
      {
        lang: origin.lang - i,
        lat: origin.lat + i,
      },
    ];
    let j = 1;
    // let finish = false;

    for (let point of points) {
      const placeText = document.createElement("a-box");
      placeText.setAttribute(
        "gps-entity-place",
        `latitude: ${point.lat}; longitude: ${point.lang};`
      );
      // console.log(`latitude: ${point.lat}; longitude: ${point.lang};`);
      placeText.setAttribute(
        "value",
        `lat:${point.lat}; \n long: ${point.lang} \n dir=${Direction[j].name}`
      );
      console.log(
        `lat:${point.lat}; \n long: ${point.lang} \n dir=${Direction[j].name}`
      );
      placeText.setAttribute("scale", "10 10 10");
      placeText.setAttribute("position", {
        x: 0,
        y: 0,
        y: 0,
      });
      placeText.setAttribute("material", `color:${Direction[j].color}`);
      placeText.addEventListener("loaded", () => {
        window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
      });
      parrentElement.appendChild(placeText);
      j++;
    }
  }
}

function calculateDistance(lat1, long1, lat2, long2) {
  //radians
  lat1 = (lat1 * 2.0 * Math.PI) / 60.0 / 360.0;
  long1 = (long1 * 2.0 * Math.PI) / 60.0 / 360.0;
  lat2 = (lat2 * 2.0 * Math.PI) / 60.0 / 360.0;
  long2 = (long2 * 2.0 * Math.PI) / 60.0 / 360.0;

  // use to different earth axis length
  var a = 6378137.0; // Earth Major Axis (WGS84)
  var b = 6356752.3142; // Minor Axis
  var f = (a - b) / a; // "Flattening"
  var e = 2.0 * f - f * f; // "Eccentricity"

  var beta = a / Math.sqrt(1.0 - e * Math.sin(lat1) * Math.sin(lat1));
  var cos = Math.cos(lat1);
  var x = beta * cos * Math.cos(long1);
  var y = beta * cos * Math.sin(long1);
  var z = beta * (1 - e) * Math.sin(lat1);

  beta = a / Math.sqrt(1.0 - e * Math.sin(lat2) * Math.sin(lat2));
  cos = Math.cos(lat2);
  x -= beta * cos * Math.cos(long2);
  y -= beta * cos * Math.sin(long2);
  z -= beta * (1 - e) * Math.sin(lat2);

  return Math.sqrt(x * x + y * y + z * z) / 1000;
}

function calculateTheSecondPoint(latitude, longitude, distance, bearing) {
  // taken from: https://stackoverflow.com/a/46410871/13549
  // distance in KM, bearing in degrees

  const R = 6378.1 * 1000; // Radius of the Earth
  const brng = (bearing * Math.PI) / 180; // Convert bearing to radian
  let lat = (latitude * Math.PI) / 180; // Current coords to radians
  let lon = (longitude * Math.PI) / 180;

  // Do the math magic
  lat = Math.asin(
    Math.sin(lat) * Math.cos(distance / R) +
      Math.cos(lat) * Math.sin(distance / R) * Math.cos(brng)
  );
  lon += Math.atan2(
    Math.sin(brng) * Math.sin(distance / R) * Math.cos(lat),
    Math.cos(distance / R) - Math.sin(lat) * Math.sin(lat)
  );

  // Coords back to degrees and return
  return [(lat * 180) / Math.PI, (lon * 180) / Math.PI];
}
