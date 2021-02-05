window.onload = () => {
  const button = document.querySelector('button[data-action="change"]');
  button.innerHTML = "?";

  const palces = staticLoadPlaces();
  renderPlaces(palces);
};

function staticLoadPlaces() {
  return [
    {
      name: "Pokèmon",
      location: {
        lat: 35.792786,
        lng: 51.500243,
      },
    },
  ];
}

var models = [
  {
    url: "./assets/magnemite/scene.gltf",
    scale: "0.5 0.5 0.5",
    info: "Magnemite, Lv. 5, HP 10/10",
    rotation: "0 180 0",
  },
  {
    url: "./assets/articuno/scene.gltf",
    scale: "0.2 0.2 0.2",
    rotation: "0 180 0",
    info: "Articuno, Lv. 80, HP 100/100",
  },
  {
    url: "./assets/dragonite/scene.gltf",
    scale: "0.08 0.08 0.08",
    rotation: "0 180 0",
    info: "Dragonite, Lv. 99, HP 150/150",
  },
];

var modelIndex = 0;
var setModel = (model, entity) => {
  if (model.sacle) {
    entity.setAttribute("scale", model.scale);
  }

  if (model.rotation) {
    entity.setAttribute("rotation", model.rotation);
  }

  if (model.position) {
    entity.setAttribute("position", model.position);
  }

  entity.setAttribute("gltf-model", model.url);

  const div = document.querySelector(".instructions");
  div.innerHTML = model.info;
};

function renderPlaces(places) {
  let scene = document.querySelector("a-scene");

  places.forEach((element) => {
    let latitude = element.location.lat;
    let longitutide = element.location.lng;

    let model = document.createElement("a-entity");
    model.setAttribute(
      "gps-entity-place",
      `latitude: ${latitude}; longitude: ${longitutide}`
    );

    setModel(models[modelIndex], model);
    model.setAttribute("animation-mixer", "");

    document
      .querySelector('button[data-action="change')
      .addEventListener("click", () => {
        var entity = document.querySelector("[gps-entity-place]");
        modelIndex++;
        let newIndex = modelIndex % models.length;
        setModel(models[newIndex], entity);
      });

    scene.appendChild(model);
  });
}
