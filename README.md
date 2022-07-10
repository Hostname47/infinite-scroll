# Infinite scroll
This is a simple infinite scroll feature to grab articles from The New York Times API, and everytime the user reach the fetch-more element, we run an asynchronous call to the API to get more articles by incrementing the page parameter.
The scroll and detection of fetch more element is implemented using **Intersection Observer API** instead of listening to scroll event on the scrollable container.

### Contributing
If you find any bug or something that can make this snippet better, don't hesitate to suggeste your changes and I'll be very happy to review and merge your code.
