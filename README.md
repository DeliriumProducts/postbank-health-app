# postbank-health-app

- fitness/health tracking app
- Google Fit integration
- PWA
- Postbank Branding
- ant.design
- award system
- leaderboards
- works offline
- admin panel for adding goals

## Scoring

- score points are calculated based on calories and a weighting system where more intensitve activities have a higher weight

for example: 
swimming: points = 80% of calories * 0.1
running: points = 60% of calories * 0.1 
walking: points = 15% of calories * 0.1

## Fetching 

- fetch top 5 with their points
  - 1: 1300
  - 2: 1000
  - 3: 850
  - 4: 830
  - 5: 600

## Firebase schema


- store user points in
    /users/{user}
  in an object as 
  ```json
  {
    "points": 800,
  }
  ```

- store user awards in 
  /user/{user}/awards/{awardId}

  ```json
  {
      "title": "10% discount"
  }
  ```

  

  

