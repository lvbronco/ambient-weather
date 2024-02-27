const AmbientWeatherApi = require('ambient-weather-api');
const apiKey = 'f1e8510c8dd847c7a4beefce0baea5040745d68d050e47819c77b0a6f95345c8';
const applicationKey = 'ba4279ba6faa45a19fc26cba4137d6e8423ba2a0e8a04e39af64d3b57a3916e9';

const api = new AmbientWeatherApi({
  apiKey,
  applicationKey
})

// list the user's devices
api.userDevices()
.then((devices) => {

  devices.forEach((device) => {
    // fetch the most recent data
    api.deviceData(device.macAddress, {
      limit: 1
    })
    .then((deviceData) => {
      console.log('The most recent temperature reports for ' + device.info.name + ' - ' + device.info.location + ' :: ' + device.macAddress)
      deviceData.forEach((data) => {
        console.log(data)
      })
      console.log('---')
    })
  })
})