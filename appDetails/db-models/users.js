module.exports = (bookshelf) => {
    const User = bookshelf.Model.extend({
        tableName: 'users',
        questions: function() {
            return this.hasMany('Question');
        }
    });

    bookshelf.model('User', User);
};
