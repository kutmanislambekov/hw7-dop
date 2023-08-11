const postsContainerEl = document.getElementById('posts-container');
const loaderEl = document.getElementById('loader');
const filterEl = document.getElementById('filter');

let page = 1;
let limit = 10;
let loaderIndicator = false;
let dataFromBack = []

const renderItem = (post) => {
    const { id, title, body } = post;

    return `
        <div class="post">
            <div class="number">${id}</div>
            <div class="post_info">
                <h2>${title}</h2>
                <p class="post_body">${body}</p>
            </div>
        </div>
  `;
};

const getData = async () => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);
        const data = await response.json();
        dataFromBack = [...dataFromBack, ...data]
        page += 1;

        return data;
      } catch (err) {
        console.log(err);
    }
};

const renderPosts = async () =>{
    loaderEl.classList.add('show');
    loaderIndicator = true;

    const data = await getData();

    postsContainerEl.innerHTML += data.reduce((storage, post)=>{
        return(storage += renderItem(post));
    }, '');

    loaderEl.classList.remove('show');
    loaderIndicator = false;

};

renderPosts();


const onWindowScroll = () =>{
    if (loaderIndicator) {
        return;
    }

    const {scrollHeight, clientHeight, scrollTop} = document.documentElement;

    if (scrollTop  + clientHeight + 1 >=scrollHeight) {
        renderPosts();
    }
}
const searchPosts = (event)=>{
    const term = event.target.value.toLowerCase();
    const filteredPosts = dataFromBack.filter((el)=> `${el.title} ${el.body}${el.id}`.toLowerCase().includes(term));
    postsContainerEl.innerHTML = filteredPosts.reduce((storage, post)=>{
        return(storage += renderItem(post));
    },'');
};

window.addEventListener('scroll', onWindowScroll)
filterEl.addEventListener('input', searchPosts)
