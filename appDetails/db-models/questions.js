'use strict';

module.exports = (bookshelf) => {
    const Question = bookshelf.Model.extend({
        tableName: 'questions',
        user: function () {
            return this.belongsTo('User');
        },
    });

    bookshelf.model('Question', Question);
};
