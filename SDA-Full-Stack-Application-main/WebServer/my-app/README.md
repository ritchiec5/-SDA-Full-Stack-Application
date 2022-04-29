# Ant Design Pro

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## More

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).

## Configuration

### Configurating Cameras for Testing (React)
- To add more camera source
- Navigate to /React/my-app/src/pages/Distance_AI/components/Test_Cameras/templates/index.jsx
- Add the code below to the jsx file with the preferred configurations

```bash
<img
  src="http://42.60.113.58:5003/video/0"
  alt="Capturing Device #0"
  width="500"
  height="400"
/>
```

src: The url of the ip camera\
alt: The alternative information\
width/height: Set the width and height of the live video


### Configurating LiveStream Cameras (React)
- To add more camera source
- Navigate to /React/my-app/src/pages/Distance_AI/components/Distance_LiveStream/templates/index.jsx

#### Camera:
- Add the code below inside the class with the preferred configurations
```bash
<img
  src="http://42.60.113.58:5003/video/0"
  alt="Capturing Device #0"
  width="500"
  height="400"
/>
```

src: The url of the ip camera\
alt: The alternative information\
width/height: Set the width and height of the live video\

- Add the respective class in the jsx code
```bash
<div className="camera-container">
  {this.state.title === "ALL CAMERAS" ? (
    <AllCameras/>
  ) : this.state.title === "Location #01 (Camera 01)" ? (
    <FirstCamera />
  ) : this.state.title === "Location #02 (Camera 02)" ? (
    <SecondCamera />
  ) : null}
</div>
```


#### Dropdown:
- Add more options to the dropdown
```bash
const options = [
  { value: "0", label: "ALL CAMERAS" },
  { value: "1", label: "1st CAMERA" },
  { value: "2", label: "2nd CAMERA" },
];
```

#### Changing Title Based On Dropdown:
- Add more menu items
```bash
const menu = (
  <Menu onClick={handleChange}>
    <Menu.Item key="ALL CAMERAS">
      ALL CAMERAS
    </Menu.Item>
    <Menu.Item key="Location #01 (Camera 01)">
      Location #01 (Camera 01)
    </Menu.Item>
    <Menu.Item key="Location #02 (Camera 02)">
      Location #02 (Camera 02)
    </Menu.Item>
  </Menu>
);
```
