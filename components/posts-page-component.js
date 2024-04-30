import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, setPosts, user, page } from "../index.js";
import { deletePost, disLike, getPosts, getUsersPosts, like } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from 'date-fns/locale';
import { sanitize } from "../helpers.js";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  
  console.log("Актуальный список постов:", posts);

  const postsHtml = posts.map((post) => {

    const createDistanseToNow = formatDistanceToNow(post.createdAt, {locale: ru});

    const length = (post.likes.length) - 1;
    
    let likeNames;
    let name = sanitize(post.likes[0]?.name || "");
    if (post.likes.length <= 1) {
      likeNames = name;
    } else {
      likeNames = name + " и ещё " +  length;
    }

    return `<li class="post">
    <div class="post-header" data-user-id=${post.user.id}>
        <img src=${post.user.imageUrl} class="post-header__user-image">
        <p class="post-header__user-name">${sanitize(post.user.name)}
        </p>
    </div>
    <div class="post-image-container">     
      <img class="post-image" src=${post.imageUrl}>      
      <img src="./assets/images/Krestiksvgpng.ru_.svg" class=${(post.user.id === user?._id) ? "delete-button" : "hide"} data-id=${post.id}  width="30" height="30">
    </div>
    <div class="post-likes">
      <button data-id=${post.id} data-isliked=${post.isLiked} data-user-id=${post.user.id} class="like-button">
      <img src=${post.isLiked ? "./assets/images/like-active.svg" : "./assets/images/like-not-active.svg"}>
      </button>
      <p class="post-likes-text">
        Нравится: <strong>        
        ${post.likes.length > 0 ? likeNames : "0"}
        </strong>
      </p>
    </div>
    <p class="post-text">
      <span class="user-name">${sanitize(post.user.name)}</span>
      ${post.description}
    </p>
    <p class="post-date">
      ${createDistanseToNow} назад
    </p>
  </li>
  `
  }).join("");


  const appHtml = `
  <div class="page-container">
  <div class="header-container"></div>
     <ul class="posts">${postsHtml}    
     </ul>
  </div>
  `
   
  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }  

  for (let userLike of document.querySelectorAll(".like-button")) {
    userLike.addEventListener("click", () => {
      console.log("нажал на лайк"); 

      const postIsLiked = userLike.dataset.isliked;
      postIsLiked === 'true' ? true : false;

      if(!user) {
        alert("Чтобы поставить лайк, необходимо авторизоваться");
      }
             
      if (postIsLiked === 'true') {
        disLike({ 
          token: getToken(), 
          id: userLike.dataset.id, 
        }).then(() => {
          if (page === USER_POSTS_PAGE) {
            getUsersPosts({ id: userLike.dataset.userId, token: getToken() }).then((newPosts) => {
              setPosts(newPosts);
              renderPostsPageComponent({ appEl });  
            });
          } else {
            getPosts({ token: getToken() }).then((newPosts) => {
              setPosts(newPosts);
              renderPostsPageComponent({ appEl });          
            });
          }          
        });    
      } else {
        like({ 
          token: getToken(), 
          id: userLike.dataset.id, 
        }).then(() => {
          if (page === USER_POSTS_PAGE) {
            getUsersPosts({ id: userLike.dataset.userId, token: getToken() }).then((newPosts) => {
              setPosts(newPosts);
              renderPostsPageComponent({ appEl });  
            });
          } else {
            getPosts({ token: getToken() }).then((newPosts) => {
              setPosts(newPosts);
              renderPostsPageComponent({ appEl });          
            });
          }
        });
      }
    });
  }

 

  for (let deleteButton of document.querySelectorAll(".delete-button")) {
    deleteButton.addEventListener("click", () => {
      console.log("нажал удалить"); 
      let result = confirm('Вы действительно хотите удалить пост?');
      if (result === true) {
      deletePost({ 
        token: getToken(), 
        id: deleteButton.dataset.id
      }).then(() => {
        getPosts({ token: getToken() }).then((newPosts) => {
          setPosts(newPosts);
          renderPostsPageComponent({ appEl });
        })        
      })
      }
    })
  }
}
