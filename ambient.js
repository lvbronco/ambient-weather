//App Key - ba4279ba6faa45a19fc26cba4137d6e8423ba2a0e8a04e39af64d3b57a3916e9

// require('dotenv').config()
const AmbientWeatherApi = require('ambient-weather-api');

// import AmbientWeatherApi from "AmbientWeatherApi";

const apiKey = 'f1e8510c8dd847c7a4beefce0baea5040745d68d050e47819c77b0a6f95345c8';

const api = new AmbientWeatherApi({
  apiKey,
  applicationKey: 'ba4279ba6faa45a19fc26cba4137d6e8423ba2a0e8a04e39af64d3b57a3916e9'
})

// // list the user's devices
// api.userDevices()
// .then((devices) => {

//   devices.forEach((device) => {
//     // fetch the most recent data
//     api.deviceData(device.macAddress, {
//       limit: 5
//     })
//     .then((deviceData) => {
//       console.log('The 5 most recent temperature reports for ' + device.info.name + ' - ' + device.info.location + ':')
//       deviceData.forEach((data) => {
//         console.log(data.date + ' - ' + data.tempf + '°F')
//       })
//       console.log('---')
//     })
//   })
// })


// helper function
function getName (device) {
  return device.info.name
}

api.connect()
api.on('connect', () => console.log('Connected to Ambient Weather Realtime API!'))

api.on('subscribed', data => {
  console.log('Subscribed to ' + data.devices.length + ' device(s): ')
  console.log(data.devices.map(getName).join(', '))
})
api.on('data', data => {
  console.log(data.date + ' - ' + getName(data.device) + ' current outdoor temperature is: ' + data.tempf + '°F')
  // console.log(data)
  const size = Buffer.byteLength(JSON.stringify(data))
  console.log('Data size: ' + size)
})
api.subscribe(apiKey)