import co from 'co';
import Config from 'config';
import Chalk from 'chalk';
import fetch from 'node-fetch';
import logger from '../lib/logger';

const CHUNK_SIZE = 50;
const SPUTNIK = Chalk.bold.blue('Sputnik API');
const SPUTNIK_CONTACTS = SPUTNIK + ' ' + Chalk.blue('POST Contacts');
const SPUTNIK_CONTACTS_ENDPOINT = 'https://esputnik.com.ua/api/v1/contacts';

let { user, pass } = Config.get('esputnik');
const SPUTNIK_AUTH = new Buffer(user + ':' + pass).toString('base64');

export default class Sputnik {
    static updateContacts(contacts) {
        return co(function*(){
            logger.info(SPUTNIK_CONTACTS + ' Begin update');

            let iterations = Math.ceil(contacts.length / CHUNK_SIZE);
            for (let i = 0; i < iterations; i++) {
                let start = CHUNK_SIZE * i;
                let end   = CHUNK_SIZE * (i + 1);
                if (end > contacts.length) {
                    end = contacts.length;
                }

                let sub = contacts.slice(start, end);

                // Prepare request
                let body = {
                    contacts: sub.map((contact) => {
                        let channels = [];
                        if (contact.email) {
                            channels.push({
                                type: 'email',
                                value: contact.email
                            });
                        }
                        if (contact.phone) {
                            channels.push({
                                type: 'sms',
                                value: contact.phone
                            });
                        }

                        return {
                            id: contact.id,
                            firstName: contact.name,
                            channels
                        };
                    }),
                    dedupeOn: 'email_or_sms'
                };
                let headers = {
                    Authorization: 'Basic ' + SPUTNIK_AUTH,
                    'Content-Type': 'application/json;charset=utf-8'
                };

                let options = {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(body)
                };


                try {
                    let response = yield fetch(SPUTNIK_CONTACTS_ENDPOINT, options);
                    logger.info(SPUTNIK_CONTACTS + ' ' + Chalk.bold(end + '/' + contacts.length) + ' done');
                } catch (error) {
                    logger.error(SPUTNIK_CONTACTS + ' Request error: ' + error);
                }
            }
        });
    }
}