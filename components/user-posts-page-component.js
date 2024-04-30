export function renderUserPostsPageComponent({ appEl }) {
    
    getUsersPosts().then((responseData) => {
        console.log(responseData);
        const appUsersPosts = responseData.posts.map((post) => {
            return {

            }
        })

        appEl.innerHTML = appUsersPosts;

    });
    
}