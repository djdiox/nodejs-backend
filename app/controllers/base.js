module.exports = {
    /**
     * Will Create a basic CRUD Route for an Mongoose Model
     * Used as a Base Service.
     * So the first Injection only returns a factory
     * 
     * @param {Object} mongoose Mongoose ODM
     * @param {Object} uuid UUID module for node
     * @param {Objedct} log logger instance
     * @returns {Object} the Instance of the Factory
     */
    handlers: (mongoose, uuid, log) => {
        const createInstance = (currentModel) => {
            /**
             * Creates an Object with an Model in the Database
             * 
             * @param {Object} dbObject The Object to be created.
             * @returns {Promise} the Promise of the action
             */
            const create = (dbObject, requestUserID) => {
                dbObject.uuid = uuid.v4();
                dbObject.created_at = new Date();
                if (typeof requestUserID !== 'undefined') {
                    dbObject.user_id = requestUserID;
                }
                return currentModel.create(dbObject);
            };

            /**
             * Edits an Model in the Database.
             * 
             * @param {Object} dbObject 
             * @returns {Promise} the Promise of the Action
             */
            const edit = (dbObject) => {
                dbObject.edited_at = new Date();
                return currentModel.update({ uuid: dbObject.uuid }, dbObject);
            };

            /**
             * Removes a Element from the database
             * 
             * @param {string} uuid UUID of the current Element
             * @returns {Promise} Promise of the Action
             */
            const remove = (uuid) => {
                return currentModel.remove({ uuid: uuid });
            };

            /**
             * Gets a List or simple filtered by an Object
             * 
             * @param {Object} [filters={}] filters is equal to result objects
             * @returns {Promise} the Promise of the Action
             */
            const get = (filters = {}) => {
                return currentModel.find(filters);
            };

            /**
             * Parses a JSON based or logs the error
             * 
             * @param {any} body 
             * @returns 
             */
            const parseBody = (body) => {
                try {
                    return JSON.parse(body);
                } catch (err){
                    return log.error(err);
                }
            };
            return {
                create,
                edit,
                remove,
                get,
                parseBody
            };
        };

        return {
            createInstance
        };
    }
};