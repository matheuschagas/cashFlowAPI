let db = require('../db');


// Create new transaction in your database and return its id
exports.create = async (description, amount, paymentType, user) => {
    let transaction = {
        description: description,
        amount: amount,
        paymentType: paymentType,
        user: await user,
    };
    return await db.set('insert', 'transact', transaction, {});
};

exports.update = async (fields, id) => {
    return await db.set('update', 'transact', fields, {id});
};

exports.delete = async (id) => {
    return await db.set('delete', 'transact', {}, {id});
};

// Get transactions
exports.listAll = async () => {
    let transacions = await db.fetchAll('select', 'transact', {}, {});
    return transacions;
};

exports.dashboardInfo = async () => {
    let transacions = await db.query('SELECT'+
    "(SELECT sum(amount) FROM transact WHERE transactionDate BETWEEN date(CURRENT_TIMESTAMP, '-1 MONTH' ) AND CURRENT_TIMESTAMP),"+
    "(SELECT sum(amount) FROM a WHERE `date` BETWEEN date(CURRENT_TIMESTAMP, '-1 day' ) AND CURRENT_TIMESTAMP)')";
    return transacions;
};