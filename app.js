import co from 'co';
import logger from './lib/logger';
import Clients from './api/Clients';
import Sputnik from './api/Sputnik';

logger.info('Export START');

co(function*(){
    const clients = yield Clients.getAll();
    yield Sputnik.updateContacts(clients);
}).then(() => {
    logger.info('Export FINISH');
    process.exit(0);
}).catch((error) => {
    logger.error('Export ERROR: ' + error);
    process.exit(1);
});