---
title: Dashcam Routes Webapp
date: 2020-03-20T04:36:51.802Z
link: https://github.com/Sammyalhashe/commai-source
lessons:
  - description: >-
      The original dataset consisted of more than 500 unique car trips. This
      data was presented in the form of Json and all together had a total size
      of about 70M. I initially tried to load the entire dataset on the map at
      once, but displaying the geolocation lines of 70M of data on the map was
      way too slow. To get around this, I adopted a methodology to split the
      database based on different zooms of the map. The idea was that the larger
      the zoom, the less geolocation points were needed to be rendered on the
      map. To partition the dataset, I decided to take data every n seconds.
      Under further consideration, I should have split by the distance to get
      more consistent visual results.
    lesson: Learned to partition large datasets
  - description: >-
      This was a complete full-stack application, with the frontend written in
      Angular, and the backend an expressJS application that connects to a
      MongoDB connection storing the trip data. One of the best lessons I
      learned from this was the ability to configure a full application
      correctly, and more importantly, organize it in such a way to make it easy
      to deploy.
    lesson: Learned to architect a complete full-stack application
  - description: >-
      During this coding challenge, I was given a week to present my final
      product. This was by far the quickest application I had to develop, and it
      was really daunting at first (not to mention that I still had five classes
      and a thesis and capstone to do). To make this easier, I decided to take a
      very structured approach to this. I would first research, fully knowing
      the components/techniques I would be using before I even hit the keyboard.
      I committed to fully engaging with any documentation I read. I tackled one
      issue at a time to keep my conerns modular. I first tackled setting up the
      database and writing scripts to partition the data. Then I worked on
      wipping up a simple expressJS application to connect to the Mongo
      database. Once I knew that loading 72mb of data onto a UI would lead to an
      inefficient algorithm, I eventually created three endpoints (and thus
      three mongo collections) based on zoom. I mainly worked on the frontend in
      tandem with the express app. My main issue with the frontend was
      researching ways to display car's geolocation and how to performantly load
      and cache json data.
    lesson: >-
      Learned to organize myself and complete a project on a very short
      timeframe
---
[<img src="/img/screen-shot-2020-03-20-at-12.45.06-am.png" width="700" />](/img/screen-shot-2020-03-20-at-12.45.06-am.png)

### Summary

* Completed a coding challenge requiring me to create a performant web app displaying more than 500 different car trips.
* These car trips were made for data collection for self-driving cars.
* Each trip is a `json` file with a start and end time. The `json` file also contains a `coords` array, which contains data points sampled every second during the trip. Each data point contains the coordinates and the speed at the time of sampling.

### Backend

* The backend was built using a simple `express` app. The express app has three routes; one for each of the datasets. It is a pretty simple frontend with nothing that fancy. I wanted to do more data parsing on the server end, but the map package, `leaflet`, made this difficult as it requires the coordinates to be wrapped in a function that defines layers on top of the map, which is not available in the backend. One option that could have been worth looking more into was
  `leaflet-headless` which seemed to get around the inability to use the package in the backend (it defines a "pseudo-window"), but as I have school I couldn't really look into it anymore.

### Database

* The data was loaded into a Mongodb Atlas cluster. The datasets were split into three different collections based on different zooms of the map.

### Frontend

The frontend was built in `angular`. Its breakdown is as follows:

* `AppModule` is the main module
  * imports the `RoutingModule` and `MaterialModule` which imports Angular Material Components
  * `AppComponent` that the app bootstraps to; it contains the route outlet where other routes are placed.
  * `MapComponent`, which contains the actual map and displays the data.
    * [`leaflet`](https://leafletjs.com/) is the package used to create the interactive map.
      In routing to the map component, data is prefetched before the component loads using a route resolver. This resolver uses another service, `TripsService`, to fetch the data, which acts as a global way to fetch data and change state depending on if data is being fetched or not. Data is parsed on the client side, which I wanted to change.

Client-side caching is implemented with an `HttpInterceptor`. When data is being fetched, it checks whether the data has already been recieved and stored in a cache. If it hasn't, the data is downloaded, but if it has, the data is simply taken from the cache.

* See <https://github.com/Sammyalhashe/commai-source>
