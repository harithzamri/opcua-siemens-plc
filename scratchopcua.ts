import {
  OPCUAClient,
  MessageSecurityMode,
  SecurityPolicy,
  AttributeIds,
  makeBrowsePath,
  ClientSubscription,
  TimestampsToReturn,
  MonitoringParametersOptions,
  ReadValueIdLike,
  ClientMonitoredItem,
  DataValue,
} from "node-opcua";

var client = new OPCUAClient();

var endpointURL = "opc.tcp://192.168.0.1:4840";
var the_session = null;
var subscription = null;

client.connect(endpointURL, (err) => {
  if (err) {
    console.log("cannot connect to endpoint:", endpointURL);
  } else {
    console.log("connected !");

    client.createSession(function (err, session) {
      if (!err) {
        the_session = session;
      }

      testMonitor("nodetag");
    });
  }
});

function testMonitor(id) {
  let count = 0;

  const subscription = ClientSubscription.create(the_session, {
    requestedPublishingInterval: 1000,
    requestedLifetimeCount: 100,
    requestedMaxKeepAliveCount: 10,
    maxNotificationsPerPublish: 100,
    publishingEnabled: true,
    priority: 10,
  });

  let monitoredItem = subscription.monitor(
    { nodeId: "ns=4;i=5", attributeId: AttributeIds.Value },
    { samplingInterval: 100, discardOldest: true, queueSize: 1 }
  );
}
