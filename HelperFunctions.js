const Axios = require("axios");

const getWeather = async (city) => {
    try {
      let result = await Axios.post(
        process.env.WEATHER_WEBHOOK,
        { city: city },
        { headers: { webhook_key: process.env.WEATHER_WEBHOOK_KEY } }
      );
      console.log(result.data)
      return result.data;
    } catch (error) {
      console.log("EROOR", error);
    }
}

module.exports = {getWeather}