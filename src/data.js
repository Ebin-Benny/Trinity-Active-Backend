function insert() {
    var instance = new UserModel({ userid: 'john', years: [] });

    instance.save(function (err) {
        if (err) return null;

    });
}

module.exports.insert = insert;