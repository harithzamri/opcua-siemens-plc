// declaration
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
var async = require("async");
const connectionStrategy = {
  initialDelay: 1000,
  maxRetry: 1,
};

const options = {
  applicationName: "myClient",
  connectionStrategy: connectionStrategy,
  securityMode: MessageSecurityMode.None,
  securityPolicy: SecurityPolicy.None,
  endpoint_must_exist: true,
};

const client = OPCUAClient.create(options);
const endpointUrl = "opc.tcp://192.168.0.1:4840";

async function main() {
  try {
    // connecting
    await client.connect(endpointUrl);
    console.log("connected");
  } catch (error) {
    console.log("An error has occured: ", error);
  }

  const session = await client.createSession();
  console.log("session created !");

  function read(item) {
    console.log("item", item);
    var ns = item.browseName.namespaceIndex;
    var i = item.nodeId.value;
    console.log("namespaceIndex =" + ns + "" + "Identifier=" + i + "");
  }

  var opcuaServer_browse = function (item, callback) {
    session.browse(item, function (err, itemResults) {
      var buf = [];
      if (err) {
        console.log(err);
        console.log(itemResults);
        callback(err);
      } else {
        async.each(
          itemResults[0].references,
          function (elementChild, inner_callback) {
            session.browse(elementChild, function (element) {
              buf.push(element);
              inner_callback();
            });
          },
          function (err) {
            callback(err, buf);
          }
        );
      }
    });
  };

  console.log(opcuaServer_browse.toString());

  // for (const reference of browseResult.references) {
  //   console.log("   -> ", reference.browseName.toString());
  //   console.log("   --->", reference);
  // }

  // console.log("references of Root Folder");
  // for (const reference of browseResult.references) {
  //   console.log("->", reference.browseName.toString());
  //   // console.log(reference);
  // }
  //object -> server interfaces -> server interfaces_1 -> tag -> nodeId

  const maxAge = 0;
  const nodeToRead = {
    nodeId: "ns=4;i=5",
    attributeIds: AttributeIds.Value,
  };

  const dataValue = await session.read(nodeToRead, maxAge);
  console.log("value", dataValue.toString());

  const dataValue2 = await session.readVariableValue("ns=4;i=5");
  console.log(" value = ", dataValue2.toString());

  const subscription = ClientSubscription.create(session, {
    requestedPublishingInterval: 1000,
    requestedLifetimeCount: 100,
    requestedMaxKeepAliveCount: 10,
    maxNotificationsPerPublish: 100,
    publishingEnabled: true,
    priority: 10,
  });

  subscription
    .on("started", function () {
      console.log(
        "subscription started for 2 seconds - subscriptionId=",
        subscription.subscriptionId
      );
    })
    .on("keepalive", function () {
      console.log("keepalive");
    });
  // .on("terminated", function () {
  //   console.log("terminated");
  // });

  // install monitored item

  const itemToMonitor: ReadValueIdLike = {
    nodeId: "ns=4;i=5",
    attributeId: AttributeIds.Value,
  };
  const parameters: MonitoringParametersOptions = {
    samplingInterval: 100,
    discardOldest: true,
    queueSize: 10,
  };

  const monitoredItem = ClientMonitoredItem.create(
    subscription,
    itemToMonitor,
    parameters,
    TimestampsToReturn.Both
  );

  monitoredItem.on("changed", (dataValue: DataValue) => {
    console.log(" value has changed : ", dataValue.value.toString());
  });

  // dataValue.value.value

  async function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  await timeout(10000);

  // console.log("now terminating subscription");
  // await subscription.terminate();

  const browsePath = makeBrowsePath(
    "RootFolder",
    "/Objects/Server.ServerStatus.BuildInfo.ProductName"
  );

  const result = await session.translateBrowsePath(browsePath);
  const productNameNodeId = result.targets[0].targetId;
  console.log(" Product Name nodeId = ", productNameNodeId.toString());
}

main();
