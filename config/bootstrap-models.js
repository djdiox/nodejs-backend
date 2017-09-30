module.exports = {
    /**
     * Will make an Instance of all Models located in the models directory and return it.
     * 
     * @param {object} join The join lib
     * @param {object} log the logger
     * @param {object} fs Node.JS File System
     * @returns the function of bootstrap model
     */
    handlers: (join, log, fs) => {
        /**
         * Bootstrap all Models
         * 
         */
        const bootstrapModels = () => {
            // Bootstrap models
            const modelsPath = join(__dirname, '../app/models');
            const models = fs.readdirSync(modelsPath)
                .filter(file => ~file.indexOf('.js'));
            log.debug('Injected Models', models);
            return models.map((file) => {
                const object = require(join(modelsPath, file));
                const modelName = object.modelName;
                return {}[modelName] = object;
            }); // Inject each Model
        };
        return bootstrapModels;
    }
};