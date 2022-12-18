const execShPromise2 = require('exec-sh').promise;
const debugLog2 = console['log'];

const runConf = async (): Promise<void> => {
  try {
    const out = await execShPromise2(`docker exec -i vendors-rs-mongo mongosh --username ${process.env.MONGO_INITDB_ROOT_USERNAME} --password ${process.env.MONGO_INITDB_ROOT_PASSWORD} --authenticationDatabase admin --port ${process.env.VENDORS_DB_PORT} --eval "rs.conf()"`, true);

    debugLog2(out.stdout);
  } catch (e) {
    debugLog2('Error: ', e);
    debugLog2('Stderr: ', e.stderr);
    debugLog2('Stdout: ', e.stdout);

    return e;
  }
};

runConf();
