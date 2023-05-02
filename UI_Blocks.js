const inputBox = (placeholder, actionId) => {
    const inputBlock = {
      type: "input",
      block_id: "my_input_block",
      element: {
        type: "plain_text_input",
        action_id: "my_input_action",
      },
      label: {
        type: "plain_text",
        text: placeholder,
      },
      optional: false,
    };
    const message = {
      text: `${placeholder}:`,
      blocks: [
        inputBlock,
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Submit",
              },
              action_id: actionId,
            },
          ],
        },
      ],
    };
  
    return message;
  };


const appMentionCard = {
    text: "Please select an option:",
    blocks:[
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Get Weather",
              "emoji": true
            },
            "style": "primary",
            "value": "weather",
            "action_id": "weather_button_clicked"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Talk to ChatGPT",
              "emoji": true
            },
            "style": "primary",
            "value": "chat",
            "action_id": "chatgpt_button_clicked"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Search for an Image",
              "emoji": true
            },
            "style": "primary",
            "value": "image",
            "action_id": "image_button_clicked"
          }
        ]
      }
    ],
}

module.exports = {inputBox, appMentionCard}