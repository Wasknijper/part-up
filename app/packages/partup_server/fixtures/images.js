Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {

        if (! AWS.config.accessKeyId || ! AWS.config.secretAccessKey || ! AWS.config.region) {
            return console.log('Image fixtures could not be loaded because the amazon s3 configuration has not been set, please check your environment variables.'.red);
        }

        var downloadAndSaveImage = function(imageId, url) {
            var result = HTTP.get(url, {'npmRequestOptions': {'encoding': null}});
            var body = new Buffer(result.content, 'binary');
            Partup.server.services.images.upload(imageId + '.jpg', body, 'image/jpeg', {id: imageId});
        };

        if (Images.find().count() === 27) {
            // Networks - Lifely (open)
            downloadAndSaveImage('raaNx9aqA6okiqaS4', 'https://i.vimeocdn.com/portrait/7543891_300x300.jpg');
            downloadAndSaveImage('SEswZsYiTTKTTdnN5', 'http://lifely.nl/bundles/lifelywebsite/img/icons/icon152.png');

            // Networks - ING (public)
            downloadAndSaveImage('T8pfWebTJmvbBNJ2g', 'http://www.integrand.nl/asset/partner/ing.jpeg');
            downloadAndSaveImage('f7yzkqh9J9JvxCCqN', 'https://www.ingsprinters.nl/v287/img/authors/ing.jpg');

            // Networks - ING (invite)
            downloadAndSaveImage('efDuvuTzpqH65P9DF', 'http://www.integrand.nl/asset/partner/ing.jpeg');
            downloadAndSaveImage('fReGXG4qkNXb4K8wp', 'https://www.ingsprinters.nl/v287/img/authors/ing.jpg');

            // Networks - ING (closed)
            downloadAndSaveImage('PnYAg3EX5dKfEnkdn', 'http://www.integrand.nl/asset/partner/ing.jpeg');
            downloadAndSaveImage('4rymNTA3jFfTRKtFJ', 'https://www.ingsprinters.nl/v287/img/authors/ing.jpg');

            // Users - Default User
            downloadAndSaveImage('oQeqgwkdd44JSBSW5', 'http://img.faceyourmanga.com/mangatars/0/2/2797/normal_3810.png');

            // Users - John Partup
            downloadAndSaveImage('cHhjpWKo9DHjXQQjy', 'http://img.faceyourmanga.com/mangatars/0/6/6110/normal_6861.png');

            // Users - Judy Partup
            downloadAndSaveImage('bMTGT9oSDGzxCL3r4', 'http://img.faceyourmanga.com/mangatars/0/0/37/normal_253.png');

            // Users - Admin User
            downloadAndSaveImage('CxEprGKNWo6HdrTdq', 'http://img.faceyourmanga.com/mangatars/0/0/39/normal_511.png');

            // Partups - Crowd funding Part-up organiseren
            downloadAndSaveImage('FTHbg6wbPxjiA4Y8w', 'http://www.quick2finance.nl/wp-content/uploads/2014/04/crowdfunding2701.jpg');

            // Partups - Super secret closed ING partup
            downloadAndSaveImage('D3zGxajTjWCLhXokS', 'http://www.bloomberg.com/ss/08/09/0918_best_brands/image/86-ing.jpg');

            // Partups - A semisecret ING partup, plus ones are ok
            downloadAndSaveImage('ComeF2exAjeKBPAf8', 'http://thewshopping.be/2013/wp-content/uploads/2013/08/ing.jpg');

            // Partups - Organise a Meteor Meetup
            downloadAndSaveImage('J2KxajXMcqiKwrEBu', 'https://camo.githubusercontent.com/c3e0a56600e69a7730b5caf79959459c96c08c89/687474703a2f2f636c2e6c792f59366a6e2f76656761732e706e672532303d32303078313032');

            // Partups - Partup Premium Part-up
            downloadAndSaveImage('xfYreAouRFh4mnctk', 'http://datasymphony.com.au/wp-content/uploads/2013/11/Premium.jpg');
        }

    }
});
