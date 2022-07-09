let articlesBox = document.querySelector('#articles');
let articleSkeleton = document.querySelector('.article-skeleton');
let firstChunkFetched = false;
let page = 0;

function nytimesSearch(query='space', page=0) {
    return fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&page=${page}&api-key=iG33pGltkP0ghfzCgEeoAA7t4MscXdht`)
        .then(response => {
            return response.json();
        });
}

function append(article, articlesBox, articleSkeleton) {
    let articleComponent = articleSkeleton.cloneNode(true);

    articleComponent.querySelector('.title a').textContent = article.headline.main;
    articleComponent.querySelector('.title a').href = article.web_url;
    articleComponent.querySelector('.summary').textContent = article.snippet;
    articleComponent.querySelector('.author-and-date').textContent = article.byline.original + ' - ' + (new Date(article.pub_date)).toDateString();

    for(let keyword of article.keywords) {
        let keywordElement = document.createElement('span');
        keywordElement.classList.add('keyword');
        keywordElement.textContent = keyword.value;

        articleComponent.querySelector('.keywords-box').appendChild(keywordElement);
    }

    if(article.multimedia.length > 0) {
        let thumbnail = articleComponent.querySelector('.thumbnail');
        thumbnail.src = `http://www.nytimes.com/${article.multimedia[0].url}`;
        thumbnail.alt = article.headline.main;
    }

    articleComponent.classList.remove('none');
    articlesBox.appendChild(articleComponent);
}

/**
 * This is the first chunck fetch
 * Once we get the response, we append all the articles to articles box and increment
 * the page in order to get the next chunk where the user scroll down to the bottom
 */
nytimesSearch()
    .then(data => {
        let articles = data.response.docs;
        
        articles.forEach(article => {
            append(article, articlesBox, articleSkeleton);
        });

        firstChunkFetched = true;
        document.querySelector('#first-load-loading-box').remove();
        page++;
    })
    .catch((error) => {
        console.log(error);
    });

