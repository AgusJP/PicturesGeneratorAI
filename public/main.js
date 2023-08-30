//References to html elements
const btn = document.querySelector("#btn");
const input = document.querySelector("#input");
const radio = document.querySelectorAll('input[name="pictures"]');
const gridContainer = document.querySelector("#grid_container");
const select = document.querySelector(".select");
const caret = document.querySelector(".caret");
const menu = document.querySelector(".menu");
const options = document.querySelectorAll(".menu li");
const selected = document.querySelector(".selected");

//Toggle select styles
select.addEventListener("click", () => {
  select.classList.toggle("select-clicked");

  caret.classList.toggle("caret-rotate");

  menu.classList.toggle("menu-open");
});

//Li options styles
options.forEach((option) => {
  option.addEventListener("click", () => {
    selected.innerText = option.innerText;

    caret.classList.remove("caret-rotate");

    select.classList.remove("select-clicked");

    menu.classList.remove("menu-open");

    options.forEach((option) => {
      option.classList.remove("active");
    });

    option.classList.add("active");
  });
});

//All the steps from fetch to load the images
btn.addEventListener("click", async () => {
  if (input.value === "") {
    alert("Please enter a prompt!");
    return;
  }

  let checkedValue;
  radio.forEach((radio) => {
    if (radio.checked) {
      checkedValue = radio.value;
    }
  });

  gridContainer.innerHTML = "";

  btn.disabled = true;

  //Loaders start to show
  for (let i = 0; i < Number(checkedValue); i++) {
    const figure = document.createElement("figure");
    figure.className = "grid_container_figure";

    const span = document.createElement("span");
    span.className = "loader";

    figure.appendChild(span);
    gridContainer.appendChild(figure);
  }

  try {
    //Fetching data from our endpoint
    const res = await fetch(
      "https://dalle2-pictures-generator.onrender.com/generate-image",
      {
        method: "POST",
        body: JSON.stringify({
          prompt: `${input.value} ${selected.innerText} style`,
          n: Number(checkedValue),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
  } catch (err) {
    console.log(`Error procesando la petición: ${err}`);
  }
  //Loaders stop
  gridContainer.innerHTML = "";

  //Creating the gallery for each of the images
  for (let i = 0; i < Number(checkedValue); i++) {
    const figure = document.createElement("figure");
    figure.className = "grid_container_figure";

    const img = document.createElement("img");
    img.className = "grid_container_img";
    img.src = data.data[i].url;
    img.id = `img${Number(checkedValue)}`;

    img.addEventListener("mousemove", (event) => {
      const height = img.clientHeight;
      const width = img.clientWidth;
      const { layerX, layerY } = event;

      const yRotation = ((layerX - width / 2) / width) * 20;

      const xRotation = ((layerY - height / 2) / height) * 20;

      img.style.transform = `
        perspective(500px)
        scale(1.1)
        rotateX(${xRotation}deg)
        rotateY(${yRotation}deg)`;
    });

    img.addEventListener("mouseout", () => {
      img.style.transform = `
        perspective(500px)
        scale(1)
        rotateX(0)
        rotateY(0)`;
    });

    figure.appendChild(img);

    gridContainer.appendChild(figure);
  }

  btn.disabled = false;
});
