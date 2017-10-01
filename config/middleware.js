/**
 * Module dependencies.
 */



var env = process.env.NODE_ENV || 'development';

/**
 * Expose
 */

module.exports = {
    /**
     * Creates an Instance of the Express Handler
     * Will Handle many Dependencies and start the Mongoose Connection
     * 
     * @param {object} express Express Framework
     * @param {object} session Session for Express
     * @param {object} compression Compression for Express
     * @param {object} morgan Morgan HTTP Logger
     * @param {object} cookieParser Cookie parser for Express
     * @param {object} cookieSession Cookie Session for Express
     * @param {object} bodyParser Body Parser for Express
     * @param {object} methodOverride Method Override Parckage
     * @param {object} csrf Cross Site Request Forgery for Express
     * @param {object} mongoStore The Mongo Store Object
     * @param {object} flash Flash for Sessions in Mongo
     * @param {object} winston Winston Logger
     * @param {object} helpers Jade Helpers
     * @param {object} jade Jade Renderer
     * @param {object} config Config Object
     * @param {object} pkg package.json
     * @returns The Express Handler
     */
    handlers: (express, session, compression,
        morgan, cookieParser, cookieSession, bodyParser, methodOverride,
        csrf, mongoStore, flash, winston, helpers, jade, config, pkg, cors) => {
        const handler = (app, passport) => {

            // Compression middleware (should be placed before express.static)
            app.use(compression({
                threshold: 512
            }));

            // Static files middleware
            app.use(express.static(config.root + '/public'));

            // Use winston on production
            var log;
            if (env !== 'development') {
                log = {
                    stream: {
                        write: function (message, encoding) {
                            winston.info(message);
                        }
                    }
                };
            } else {
                log = 'dev';
            }

            // Don't log during tests
            // Logging middleware
            if (env !== 'test') app.use(morgan(log));

            // set views path and default layout
            app.set('views', config.root + '/app/views');
            app.set('view engine', 'jade');

            // expose package.json to views
            app.use(function (req, res, next) {
                res.locals.pkg = pkg;
                res.locals.env = env;
                next();
            });

            // bodyParser should be above methodOverride
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(bodyParser.json());
            app.use(methodOverride(function (req, res) {
                if (req.body && typeof req.body === 'object' && '_method' in req.body) {
                    // look in urlencoded POST bodies and delete it
                    var method = req.body._method;
                    delete req.body._method;
                    return method;
                }
            }));

            // cookieParser should be above session
            app.use(cookieParser());
            app.use(cookieSession({ secret: 'secret' }));
            app.use(session({
                secret: pkg.name,
                proxy: true,
                resave: true,
                saveUninitialized: true,
                store: new mongoStore({
                    url: config.db,
                    collection: 'sessions'
                })
            }));

            // use passport session
            app.use(passport.initialize());
            app.use(passport.session());
            
            // Add Cors Header for Clients
            app.use(cors());

            // connect flash for flash messages - should be declared after sessions
            app.use(flash());

            // should be declared after session and flash
            app.use(helpers(pkg.name));

            // adds CSRF support
            if (process.env.NODE_ENV !== 'test') {
                // app.use(csrf());

                // This could be moved to view-helpers :-)
                // app.use(function(req, res, next) {
                //     res.locals.csrf_token = req.csrfToken();
                //     next();
                // });
            }
        };
        return handler;
    }
};