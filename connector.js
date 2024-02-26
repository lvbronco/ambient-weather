const Ambient = require('ambient-weather-api');
const PubNub = require('pubnub');

const API_KEY = 'f1e8510c8dd847c7a4beefce0baea5040745d68d050e47819c77b0a6f95345c8';
const API_SECRET = 'ba4279ba6faa45a19fc26cba4137d6e8423ba2a0e8a04e39af64d3b57a3916e9';
const MAC_ADDRESS = 'YOUR_MAC_ADDRESS';
const PUBNUB_PUBLISH_KEY = 'pub-c-a109b9e0-4286-46c1-b685-681d35cb9110';
const PUBNUB_SUBSCRIBE_KEY = 'sub-c-9d1c043a-f33b-4b9b-808b-a5e141ab0d3e'; // Not used
const USER_ID = "myUniqueUserId";
const CHANNEL = 'weather.test1';

const pubnub = new PubNub({
  publishKey: PUBNUB_PUBLISH_KEY,
  subscribeKey: PUBNUB_SUBSCRIBE_KEY,
  userId: USER_ID,
});

const ambient = new Ambient({
  apiKey: API_KEY,
  applicationKey: API_SECRET
})

// helper function
function getName (device) {
  return device.info.name
}

ambient.connect()
ambient.on('connect', () => console.log('Connected to Ambient Weather Realtime API!'))

ambient.on('subscribed', data => {
  console.log('Subscribed to ' + data.devices.length + ' device(s): ')
  console.log(data.devices.map(getName).join(', '))
})
ambient.on('data', data => {
  // console.log(data.date + ' - ' + getName(data.device) + ' current outdoor temperature is: ' + data.tempf + '°F')
  console.log(data)
  publishData(data);
  // const size = Buffer.byteLength(JSON.stringify(data))
  // console.log('Data size: ' + size)
})
ambient.subscribe(API_KEY)

async function publishData(data) {
  try {
    const pubnubData = {
      windSpeed: data.windspeedmph,
      windDirection: data.winddir,
      windGust: data.windgustmph
      // Add other desired data points here
    };

    await pubnub.publish({
      channel: CHANNEL,
      message: pubnubData
    });

    console.log('Published data to PubNub');
  } catch (error) {
    console.error('Error:', error);
  }
}
