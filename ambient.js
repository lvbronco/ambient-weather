//App Key - ba4279ba6faa45a19fc26cba4137d6e8423ba2a0e8a04e39af64d3b57a3916e9

const Ambient = require('ambient-weather-api');
const PubNub = require('pubnub');
const API_KEY = 'f1e8510c8dd847c7a4beefce0baea5040745d68d050e47819c77b0a6f95345c8';
const API_SECRET = 'ba4279ba6faa45a19fc26cba4137d6e8423ba2a0e8a04e39af64d3b57a3916e9';
const MAC_ADDRESS = 'YOUR_MAC_ADDRESS';
const PUBNUB_PUBLISH_KEY = 'pub-c-a109b9e0-4286-46c1-b685-681d35cb9110';
const PUBNUB_SUBSCRIBE_KEY = 'sub-c-9d1c043a-f33b-4b9b-808b-a5e141ab0d3e'; // Not used
const USER_ID = "myUniqueUserId2";
const pubnubChannel = 'weather.test1';
const deviceId = '48:55:19:C2:FF:8A';

const apiKey = 'f1e8510c8dd847c7a4beefce0baea5040745d68d050e47819c77b0a6f95345c8';
const applicationKey = 'ba4279ba6faa45a19fc26cba4137d6e8423ba2a0e8a04e39af64d3b57a3916e9';

const pubnub = new PubNub({
  publishKey: PUBNUB_PUBLISH_KEY,
  subscribeKey: PUBNUB_SUBSCRIBE_KEY,
  userId: USER_ID,
});

const ambient = new Ambient({
  apiKey: API_KEY,
  applicationKey: API_SECRET
})


// Function to retrieve current weather data and publish to PubNub
async function publishWeatherData() {
  try {

    const data = await ambient.deviceData(deviceId, {
      limit: 1
    }).then((deviceData) => {
      return deviceData[0];
      // deviceData.forEach((data) => {
      //   console.log(data)
      // })
      // console.log('---')
    });

    const randomValue1 = Math.random();
    const randomValue2 = Math.random(data.dateutc);
    const plusorminus = Math.sign(2*Math.random() - 1);
    const randomPercentage1 = 1 + (plusorminus * ((randomValue1 * 20) + 5) / 100);
    const randomPercentage2 = 1 + (plusorminus * ((randomValue2 * 10) + 5) / 100);
    console.log('Random Percentage 1:', randomPercentage1);
    console.log('Random Percentage 2:', randomPercentage2);
    
    // Extract relevant data points (customize as needed)
    const pubnubData = {
      windSpeed: Math.round((data.windspeedmph * randomPercentage1) * 100) / 100,
      windDirection: Math.round(data.winddir * randomPercentage2),
      windGust: data.windgustmph
    };

    await pubnub.publish({
      channel: pubnubChannel,
      message: pubnubData,
    });

    console.log('Published weather data to PubNub:', pubnubData);
  } catch (error) {
    console.error('Error fetching or publishing data:', error);
  }
}

// Set up interval to fetch and publish data periodically
const publishInterval = 0.5 * 60 * 1000; // 5 minutes (adjust as needed)

setInterval(publishWeatherData, publishInterval);

// // Optionally subscribe for testing (replace with subscribeKey if different)
// if (pubnubSubscribeKey) {
//   pubnub.subscribe({
//     channels: [pubnubChannel],
//     callback: (message) => {
//       console.log('Received message from PubNub:', message);
//     }
//   });
// }

console.log(`Node script running, publishing weather data every ${publishInterval/60000} minutes.`);