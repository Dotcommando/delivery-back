const execShPromise1 = require('exec-sh').promise;
const debugLog1 = console['log'];

const runInit = async (): Promise<void> => {
  try {
    const out = await execShPromise1(`docker exec -i vendors-rs-mongo mongosh --username ${process.env.MONGO_INITDB_ROOT_USERNAME} --password ${process.env.MONGO_INITDB_ROOT_PASSWORD} --authenticationDatabase admin --port ${process.env.VENDORS_DB_PORT} --eval \"rs.initiate({ _id: \\\"rs0\\\", members: [{ _id: 0, host: \\\"localhost:${process.env.VENDORS_DB_PORT}\\\"}]})\"`, true);

    debugLog1(out.stdout);
  } catch (e) {
    debugLog1('Error: ', e);
    debugLog1('Stderr: ', e.stderr);
    debugLog1('Stdout: ', e.stdout);

    return e;
  }
};

runInit();
