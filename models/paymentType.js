let db = require('../db');

// Get transactions
exports.listAll = async () => {
    let paymentTypes = await db.fetchAll('select', 'paymentType', {}, {});
    return paymentTypes;
};