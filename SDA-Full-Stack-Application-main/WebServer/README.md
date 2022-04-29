# Setting Up ANTDPro

## Installation & Usage

``` bash
cd react
cd my-app

# Install all modules / dependencies 
Yarn  

# Start the program
Yarn Start
```

## Username 

Username: admin, Password: ant.design 

## Configuration

### Adding Page
- Navigate to config folder
- Edit config.js

```javascript
  /* Example Routing */
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login', // page location within src/pages
        },
```

- Navigate to src/pages
- Add folder 


### Configuring AI Camera Page
- Navigate to src/pages/AiCamera/index.js
- Additional components:
  - src/pages/AiCamera/components/Video.js
  - src/pages/AiCamera/VideoContainer.js 

**Configure Fetch URL**
```javascript
  /* Netcore Web Api to Fetch */
  const baseURL = 'https://localhost:5001/AICamera'; // Adjust accordingly
```


### Configuring Dashboard page
- Navigate to src/pages/Dashboard/index.js
- Additional components:
  - src/pages/AiCamera/components/DonutChart.js
  - src/pages/AiCamera/LineChart.js
  - src/pages/AiCamera/ColumnChart.js 


**Configure Values** 
```javascript
/* 
Configure index.js line 21 
This values are hardcoded for display purposes
The logic for adding statistic whenever need violation are captured has been implemented
Reduce these values to 0 for proper data visualization
*/

    this.state = {
      TodaySD_data: 5, //eg. TodaySD_data: 0
      TodayDB_data: 10,
      WeekSD_data: [3, 4, 3.5, 5, 4.9, 5, 2],
      WeekDB_data: [3, 4, 3.5, 5, 4.9, 5, 2],
      MonthSD_data: [3, 4, 3.5, 5, 4.9, 6, 7, 9, 13, 8, 6, 6],
      MonthDB_data: [3, 4, 3.5, 5, 4.9, 6, 7, 9, 13, 8, 6, 6],
    };
```


### Configuring Live Streaming page
- Navigate to src/pages/Livestream/templates/index.js

## Test

### Running Test
``` bash
# Start the program
Yarn Start

# Test the program
Yarn test
```

### Adding Test Case
- ANTDPro test any files containing e2e example 'Test.e2e.js'
- Refer to Test.e2e.js in e2e folder for sample reference

```javascript
  /* Sample Test Case */
  describe('Login', () => {
    it('Login', async() => {
      await page.goto(`http://localhost:8000/user/login`);
      await page.waitForSelector('#username', {timeout: 60000})
      await page.type('#username', 'admin');
      await page.type('#password', 'ant.design');
      await page.waitForNavigation();
      await page.click('button[type="button"]');
    }
  )
```
