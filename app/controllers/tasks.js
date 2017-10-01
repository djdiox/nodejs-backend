module.exports = {
    handlers: (baseController, taskModel, createHttpError, log) => {
        const tasksBaseController = baseController.createInstance(taskModel);

        /**
         * Route Handler for GET Requests on Todos
         * NOTE: GetByID does not exists because simply set a filter to _id for filtering.
         * 
         * @param {Object} req Express Request
         * @param {Object} res Express Response
         * @param {Object} next Express next middleware
         */
        const getTodos = async (req, res, next) => {
            const filters = Object.keys(req.body) > 0 ?
                tasksBaseController.parseBody(req.body) : {};
            try {
                const result = await tasksBaseController.get(filters);
                res.status(200).json(result);
            } catch (err) {
                log.error(err);
                next(createHttpError(500, 'Cannot get Todos'));
            }
        };


        /**
         * Route Handler for POST Requests on Todos
         * 
         * @param {Object} req Express Request
         * @param {Object} res Express Response
         * @param {Object} next Express next middleware
         */
        const createTodo = (req, res, next) => {
            const newTodo = typeof req.body === 'object' ? req.body :
                tasksBaseController.parseBody(req.body);
            if (typeof newTodo === 'undefined' || req.body === 'undefined') {
                return next(createHttpError(400, 'Body Cannot be Empty'));
            }
            tasksBaseController.create(newTodo).then((result) => {
                res.status(200).json(result);
            }, (err) => {
                log.error(err);
                next(createHttpError(500, 'Cannot create Todo'));
            });
        };

        /**
         * Route Handler for PUT Requests on Todos
         * 
         * @param {Object} req Express Request
         * @param {Object} res Express Response
         * @param {Object} next Express next middleware
         */
        const editTodo = (req, res, next) => {
            const existingTodo = tasksBaseController.parseBody(req.body);
            if (typeof existingTodo === 'undefined' || req.body === 'undefined') {
                return next(createHttpError(400, 'Body Cannot be Empty'));
            }
            tasksBaseController.edit(existingTodo).then((result) => {
                res.status(200).json(result);
            }, (err) => {
                log.error(err);
                next(createHttpError(500, 'Cannot edit Todo'));
            });
        };

        /**
         * Route Handler for DELETE Requests on Todos
         * 
         * @param {Object} req Express Request
         * @param {Object} res Express Response
         * @param {Object} next Express next middleware
         */
        const deleteTodo = (req, res, next) => {
            if (typeof req.params.uuid === 'undefined') {
                return next(createHttpError(400, 'uuid has to be defined in the params'));
            }
            tasksBaseController.delete(req.params.uuid).then((result) => {
                res.status(200).json(result);
            }, (err) => {
                log.error(err);
                next(createHttpError(500, 'Cannot edit Todo'));
            });
        };

        return {
            getTodos,
            createTodo,
            editTodo,
            deleteTodo
        };
    }
};