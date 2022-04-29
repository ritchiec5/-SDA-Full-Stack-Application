describe('Login', () => {
  // Login function: Required to allow authentication for test cases
  const Login = () => async() => {
    await page.goto(`http://localhost:8000/user/login`);
    await page.waitForSelector('#username', {timeout: 60000})
    await page.type('#username', 'admin');
    await page.type('#password', 'ant.design');
    await page.waitForNavigation();
    await page.click('button[type="button"]');
  }

  // Test Case for AI Camera page
  it('AI Camera', async() => {
    Login();

    await page.goto(`http://localhost:8000/AI_Camera`);
    await page.waitForSelector('#page_title', {
      timeout: 2000
    });

    // Check Page Title
    const haveText = await page.evaluate(
      () => document.getElementById('page_title').textContent.includes("List of Videos"));
    expect(haveText).toBeTruthy();
  })

  // Test Case for Dash Board page
  it('DashBoard', async() => {
    Login();
    
    await page.goto(`http://localhost:8000/Dashboard`);
    await page.waitForSelector('#dangerousbehavior_linechart', {timeout: 2000});

    // Check Dangerous Behaviour Line Chart Exist
    const haveDBLineChart = await page.evaluate(
      () => document.getElementById('dangerousbehavior_linechart') !== null,
    );
    expect(haveDBLineChart).toBeTruthy();

    // Check Dangerous Behaviour Column Chart Exist
    const haveDBColumnChart = await page.evaluate(
      () => document.getElementById('dangerousbehavior_columnchart') !== null);
      expect(haveDBColumnChart).toBeTruthy();

    // Check Dangerous Behavior Text
    const havedangerousbehavior_text = await page.evaluate(
      () => document.getElementById('dangerousbehavior_text') !== null);
    expect(havedangerousbehavior_text).toBeTruthy(); 
      
    // Check Safe Distancing Line Chart Exist
    const haveSDLineChart = await page.evaluate(
      () => document.getElementById('safedistancing_linechart') !== null);
    expect(haveSDLineChart).toBeTruthy();
  
  // Check Safe Distancing Column Chart Exist
    const haveSDColumnChart = await page.evaluate(
    () => document.getElementById('safedistancing_columnchart') !== null);
    expect(haveSDColumnChart).toBeTruthy();  

    // Check Safe Distancing Text
    const havesafedistancing_text = await page.evaluate(
        () => document.getElementById('safedistancing_text') !== null);
    expect(havesafedistancing_text).toBeTruthy();      
    
  // Check Donut Chart Exist
    const haveDonutChart = await page.evaluate(
    () => document.getElementById('donutchart') !== null);
    expect(haveDonutChart).toBeTruthy();  
})  

  it('Live Streaming', async() => {
    Login();

    await page.goto(`http://localhost:8000/LiveStream`);
    await page.waitForSelector('#livestream_title', {timeout: 2000})
    
    const haveTitle = await page.evaluate(
      () => document.getElementById('livestream_title') !== null);

  }) 

});