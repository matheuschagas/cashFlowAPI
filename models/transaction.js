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