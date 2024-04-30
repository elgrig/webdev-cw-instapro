import { sanitize } from "../helpers.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";


export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    const appHtml = `
    <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container">
          </div>
          <label>
            Опишите фотографию: 
            <textarea class="input textarea" id="input-description" rows="4"></textarea>
          </label> <button class="button" id="add-button">Добавить</button>
        </div>
        `;  

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    let imageUrl="";
  
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element:appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        }
      });
    }

    const inputDescriptionElement = document.getElementById("input-description");  
   
    document.getElementById("add-button").addEventListener("click", () => {
      
      const description = inputDescriptionElement.value;

      if (!imageUrl || !description.trim()) {
        alert("Нет фото / описания");
        return;
      }
      onAddPostClick({
        description: sanitize(description),
        imageUrl,
      });
    });
  };

  render();
}



{/* <div class="upload-image">
<label class="file-upload-label secondary-button">
  <input type="file" id="image-input" class="file-upload-input" style="display: none">
  Выберите фото
</label>
</div> */}
