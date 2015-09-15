import co from 'co';
import db from '../lib/mysql';

const phonePattern = /^0\d{9}$/;

export default class Clients {
    static getAll() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM tbl_clients LIMIT 10';

            db.query(query).then((clients) => {
                co(function*(){
                    let result = [];
                    for (let client of clients) {
                        let phone = phonePattern.test(client.phone1) ? client.phone1
                            : (phonePattern.test(client.main_contact) ? client.main_contact
                            : (phonePattern.test(client.phone2) ? client.phone2 : ''));

                        result.push({
                            id: client.id,
                            name: client.name,
                            email: client.email,
                            phone
                        });
                    }

                    resolve(result);
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }
}