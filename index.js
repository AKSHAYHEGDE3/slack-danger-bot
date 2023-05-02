const { App, ExpressReceiver } = require("@slack/bolt");
const Axios = require("axios");
const { text } = require("express");
const express = require("express");
const app1 = require("./app");
const { Message, Blocks, Elements } = require("slack-block-builder");
const tesseract = require("node-tesseract-ocr");
const { appMentionCard,inputBox } = require("./UI_Blocks");
const { getWeather } = require("./HelperFunctions");
require('dotenv').config();


const boltReceiver = new ExpressReceiver({
  signingSecret: process.env.SIGNIN_SECRET,
  router: app1,
  endpoints: "/new/slack/events",
});

const app = new App({
  token: process.env.OAUTH_TOKEN, //Find in the Oauth  & Permissions tab
  signingSecret: process.env.SIGNIN_SECRET, // Find in Basic Information Tab
  receiver: boltReceiver,
  appToken:
    process.env.APP_TOKEN,
});

const postMessage = async (client, body, message) => {
  await client.chat.postMessage({
    channel: body.channel.id,
    text: "Hi there!",
    blocks: message.blocks,
    view: {
      type: "modal",
      callback_id: "my_modal",
      title: {
        type: "plain_text",
        text: "My Modal",
      },
      blocks: message.blocks,
      submit: {
        type: "plain_text",
        text: "Submit",
      },
    },
  });
};



// Listen for a mention of your app and respond with the message
app.event("app_mention", async ({ event, context, client }) => {
  const message = appMentionCard;
  try {
    // Call the chat.postMessage method using the WebClient

    const result = await client.chat.postMessage({
      channel: event.channel,
      blocks: message.blocks,
    });

  } catch (error) {
    console.error(error);
  }
});

// Listen for weather button clicks and respond with a message
app.action("weather_button_clicked", async ({ ack, body, client }) => {
  // Acknowledge the button click
  await ack();

  // Call the chat.postMessage method using the WebClient
  const message = inputBox("Enter city name", "weather_submit_button");
  // console.log(body)
  await postMessage(client, body, message);

});

// Listen for chatgpt button clicks and respond with a message
app.action("chatgpt_button_clicked", async ({ ack, body, client }) => {
  // Acknowledge the button click
  await ack();

  const message = inputBox("Enter your query", "chatgpt_submit_button");
  await postMessage(client, body, message);
});

// Listen for image button clicks and respond with a message
app.action("image_button_clicked", async ({ ack, body, client }) => {
  // Acknowledge the button click
  await ack();
  const message = inputBox("Enter image url", "image_submit_button");
  await postMessage(client, body, message);
});



app.action("weather_submit_button", async ({ ack, body, context, client }) => {
  try {
    const city = body.state.values.my_input_block.my_input_action.value;
    await ack("Thanks!");
    const weather = await getWeather(city);
    const blockPayload = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `temp:-${weather.result.temp - 273}`,
          },
        },
      ],
    };

    const messageOptions = {
      channel: body.channel.id,
      blocks: blockPayload.blocks,
    };
    await client.chat
      .postMessage(messageOptions)
      .catch((error) => {
        console.error(`Error sending message: ${error}`);
      });
  } catch (error) {
    console.error(error);
    await ack({
      response_action: "errors",
      errors: {
        input_block: "Oops! Something went wrong. Please try again.",
      },
    });
  }
});

app.action("image_submit_button", async ({ ack, body, context, client }) => {
  try {
    const imageUrl = body.state.values.my_input_block.my_input_action.value;
    const config = {
      lang: "eng",
      oem: 1,
      psm: 3,
    };
    const imageText = await tesseract.recognize(imageUrl, config);
    console.log(imageText);

    const blockPayload = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${imageText}`,
          },
        },
      ],
    };

    const messageOptions = {
      channel: body.channel.id,
      blocks: blockPayload.blocks,
    };
    await client.chat
      .postMessage(messageOptions)
      .catch((error) => {
        console.error(`Error sending message: ${error}`);
      });
  } catch (error) {
    console.error(error);
    await ack({
      response_action: "errors",
      errors: {
        input_block: "Oops! Something went wrong. Please try again.",
      },
    });
  }
});

app.action("chatgpt_submit_button", async ({ ack, body, context, client }) => {
  try {
    await ack();
    const query = body.state.values.my_input_block.my_input_action.value;
    let result = await Axios.post(
      process.env.CHATGPT_WEBHOOK,
      { text: query },
      { headers: { webhook_key: process.env.CHATGPT_WEBHOOK_KEY } }
    );
    const chatText = result.data.output;
    console.log(chatText);

    const blockPayload = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${chatText}`,
          },
        },
      ],
    };

    const messageOptions = {
      channel: body.channel.id,
      blocks: blockPayload.blocks,
    };
    await client.chat
      .postMessage(messageOptions)
      .catch((error) => {
        console.error(`Error sending message: ${error}`);
      });
  } catch (error) {
    console.error(error);
    await ack({
      response_action: "errors",
      errors: {
        input_block: "Oops! Something went wrong. Please try again.",
      },
    });
  }
});

//SWITCH CASE RESPONSE USING MESSAGE


