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

  await session.close();
}

main();
