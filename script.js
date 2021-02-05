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

var loadPlaces = (position) => {
  const params = {
    radius: 300, // search places not farther than this value (in meters)
    clientId: "F5A12URCJNBMUF4T1KG321GHMS5SAW5ZBEYUVSVXK31PT2WA",
    clientSecret: "NZAFMSKXS1BBFGSFSQ4M25QTLFU1SWL1ICGE3MT2AI5KEGUL",
    version: "20300101", // foursquare versioning, required but unuseful for this demo
  };

  const corsProxy = "https://cors-anywhere.herokuapp.com/";

  // Foursquare API (limit param: number of maximum places to fetch)
  const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
      &ll=${position.latitude},${position.longitude}
      &radius=${params.radius}
      &client_id=${params.clientId}
      &client_secret=${params.clientSecret}
      &limit=30 
      &v=${params.version}`;

  return fetch(endpoint)
    .then((res) => {
      return res.json().then((resp) => {
        return resp.response.venues;
      });
    })
    .catch((err) => {
      console.error("Error with places API", err);
    });
};

window.onload = () => {
  const scene = document.querySelector("a-scene");

  return navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("posisions", position);
      loadPlaces(position.coords).then((places) => {
        places.forEach((place) => {
          const latitude = place.location.lat;
          const longitude = place.location.lng;

          // add place name
          const placeText = document.createElement("a-link");
          placeText.setAttribute(
            "gps-entity-place",
            `latitude: ${latitude}; longitude: ${longitude};`
          );
          placeText.setAttribute("title", place.name);
          placeText.setAttribute("scale", "15 15 15");

          placeText.addEventListener("loaded", () => {
            window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
          });

          scene.appendChild(placeText);
        });
      });
    },
    (err) => console.error("Error in retrieving position", err),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 27000,
    }
  );
};
