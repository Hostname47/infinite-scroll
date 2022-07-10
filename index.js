let articlesBox = document.querySelector('#articles');
let articleSkeleton = document.querySelector('.article-skeleton');
let page = 0;
let fetchMoreLock = true;

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

    let thumbnail = articleComponent.querySelector('.thumbnail');
    thumbnail.alt = article.headline.main;
    if(article.multimedia.length > 0) {
        thumbnail.src = `http://www.nytimes.com/${article.multimedia[0].url}`;
    } else {
        thumbnail.src = `./assets/images/nytimes.png`;
        thumbnail.style.width = '85%';
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
        let fetchmore = document.querySelector('#fetch-more-loading-box');
        
        articles.forEach(article => {
            append(article, articlesBox, articleSkeleton);
        });

        document.querySelector('#first-load-loading-box').remove();
        page++;
        
        fetchmore.classList.remove('none');
        /**
         * After fetching the first chunk, we define an intersection observer to observe
         * when the user scroll to the fetch more element.
         * We used Intersection Observer API instead of the old school scroll event liteners
         * and calculating scroll and positions.
         */
        let observer = new IntersectionObserver(function(entries) {
            /**
             * Here we lock the intersection callback until we get the articles from the
             * async call.
             */
            if(entries[0].isIntersecting === true && fetchMoreLock) {
                fetchMoreLock = false;

                nytimesSearch('space', page)
                    .then(data => {
                        /**
                         * Once we get the articles successfully, we perform the following actions
                         *  - increase page to be ready for next fetch (pagination)
                         *  - unlock the intersection callback by turning lock to true
                         *  - we get the articles and append them to the articles box
                         */
                        page++;
                        fetchMoreLock = true;
                        let articles = data.response.docs;
                        
                        articles.forEach(article => {
                            append(article, articlesBox, articleSkeleton);
                        });
                    });     
            }
        }, { threshold: [0] });
        
        observer.observe(fetchmore);
    })
    .catch((error) => {
        console.log(error);
    });
