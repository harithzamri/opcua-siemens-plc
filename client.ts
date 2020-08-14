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
  securityMode: MessageSecurityMode.SignAndEncrypt,
  securityPolicy: SecurityPolicy.Basic128Rsa15,
  end_must_exist: true,
};

const client = OPCUAClient.create(options);
const endpointUrl = "opc.tcp://CSL-0192:55101";

async function main() {
  try {
    // connecting
    await client.connect(endpointUrl);
    console.log("connected");
  } catch (error) {
    console.log("An error has occured: ", error);
  }
}

main();
