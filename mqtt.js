var mqtt = require("mqtt");

var url = "wss://m16.cloudmqtt.com";

const options = {
  //   host: "wss://m16.cloudmqtt.com",
  protocolId: "MQTT",
  port: 31588,
  username: "jhfsrkth",
  password: "LeA8c8Q7ZPoH",
};

var client = mqtt.connect(url, options);

client.on("connect", function (err) {
  client.publish("test", "hello");
});

client.on("error", function (err) {
  console.log(JSON.stringify(err, null, 4));
  client.end();
});
