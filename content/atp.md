---
title: ATP Scraper API
date: 2020-03-19T19:05:23.409Z
lessons:
  - description: >-
      * I chose Flask as it is a lightweight option to create an api in python.

      * I chose python because of the availability of the BeautifulSoup4 python
      package that makes it very easy to scrape websites.

      * I learned to navigate and scrape large websites for data I needed.

      * I learned to optimize requests and make tradeoffs in my design decisions
      to boost overall performance.

      * Ie. I implemented a `TtlCache` to optimize api speed with use.

      * I reset this cache every 24hrs, knowing the ATP updates their rankings
      and stats once a day.

      * I know this because I have watched ATP tennis for 17 years.

      * I also learned how to properly design endpoints that were easy to
      understand and implement. This required me to spend a decent amount of
      time working on proper deocumentation in the form of a webapp.

      * See <https://atp-scraper.herokuapp.com/>
    lesson: Maintain a web-scraping Flask application
---
- Built a `Flask` application that scrapes the ATP website for ranking information and information on players in general (such as win/loss stats) using `BeautifulSoup4`.
- Since ATP ranking data only updates at most every day, I cache the result on the queries in a cache that expires at the start of every day.
- Implemented `docker-compose` to define a microservice for the API as well as a service used to host a test `react` app (docs).
- Implemented `unittest` and `postman` tests to validate the output from the API.
- See: <a href="https://github.com/Sammyalhashe/ATPScraper">https://github.com/Sammyalhashe/ATPScraper</a> 
