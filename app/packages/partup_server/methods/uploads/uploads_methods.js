Meteor.methods({
    /**
     * Parse a CSV file and return the containing email addresses
     *
     * @param {String} fileId
     *
     * @return {Array} emailAddresses
     */
    'uploads.parse_csv': function(fileId) {
        check(fileId, String);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'unauthorized');

        this.unblock();

        var file = Temp.findOne({_id: fileId});
        var filePath = process.env.TEMP_DIR + '/temp-' + file._id + '-' + file.original.name;

        var fs = Npm.require('fs');

        var emailAddresses = Meteor.wrapAsync(function(filePath, done) {
            fs.readFile(filePath, 'utf8', Meteor.bindEnvironment(function(err, fileContent) {
                if (err) {
                    return done(new Meteor.Error(400, 'could_not_read_uploaded_file'));
                }

                CSV()
                .from.string(fileContent, {
                        delimiter: ';', // Set the field delimiter. One character only, defaults to comma.
                        skip_empty_lines: true, // Don't generate empty values for empty lines.
                        trim: true // Ignore whitespace immediately around the delimiter.
                    })
                .to.array(Meteor.bindEnvironment(function(array) {
                    var list = lodash.chain(array)
                        .map(function(row) {
                            if (!Partup.services.validators.email.test(row[1])) return false;

                            return {
                                name: row[0],
                                email: row[1]
                            };
                        })
                        .compact()
                        .uniq(function(row) {
                            return row.email;
                        })
                        .value();

                    // Temp file is not needed anymore since we got the needed data.
                    file.remove();

                    // Limit to 200 email addresses
                    if (list.length > 200) {
                        done(new Meteor.Error(400, 'too_many_email_addresses'));
                        return;
                    }

                    done(null, list);
                }))
                .on('error', function(error) {
                    done(error);
                });
            }));

        });

        return emailAddresses(filePath);
    }
});
