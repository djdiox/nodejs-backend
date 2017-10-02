module.exports = {
    handlers: (baseController, workTimeModel, createHttpError, log) => {
        const workTimesBaseController = baseController.createInstance(workTimeModel);

        /**
         * Route Handler for GET Requests on WorkTimes
         * NOTE: GetByID does not exists because simply set a filter to _id for filtering.
         * 
         * @param {Object} req Express Request
         * @param {Object} res Express Response
         * @param {Object} next Express next middleware
         */
        const getWorkTimes = async (req, res, next) => {
            const filters = Object.keys(req.body) > 0 ?
                workTimesBaseController.parseBody(req.body) : {};
            try {
                const result = await workTimesBaseController.get(filters);
                res.status(200).json(result);
            } catch (err) {
                log.error(err);
                next(createHttpError(500, 'Cannot get WorkTimes'));
            }
        };


        /**
         * Route Handler for POST Requests on WorkTimes
         * 
         * @param {Object} req Express Request
         * @param {Object} res Express Response
         * @param {Object} next Express next middleware
         */
        const createWorkTime = (req, res, next) => {
            const newWorkTime = typeof req.body === 'object' ? req.body :
                workTimesBaseController.parseBody(req.body);
            if (typeof newWorkTime === 'undefined' || req.body === 'undefined') {
                return next(createHttpError(400, 'Body Cannot be Empty'));
            }
            workTimesBaseController.create(newWorkTime).then((result) => {
                res.status(200).json(result);
            }, (err) => {
                log.error(err);
                next(createHttpError(500, 'Cannot create WorkTime'));
            });
        };

        /**
         * Route Handler for PUT Requests on WorkTimes
         * 
         * @param {Object} req Express Request
         * @param {Object} res Express Response
         * @param {Object} next Express next middleware
         */
        const editWorkTime = (req, res, next) => {
            const existingWorkTime = workTimesBaseController.parseBody(req.body);
            if (typeof existingWorkTime === 'undefined' || req.body === 'undefined') {
                return next(createHttpError(400, 'Body Cannot be Empty'));
            }
            workTimesBaseController.edit(existingWorkTime).then((result) => {
                res.status(200).json(result);
            }, (err) => {
                log.error(err);
                next(createHttpError(500, 'Cannot edit WorkTime'));
            });
        };

        /**
         * Route Handler for DELETE Requests on WorkTimes
         * 
         * @param {Object} req Express Request
         * @param {Object} res Express Response
         * @param {Object} next Express next middleware
         */
        const deleteWorkTime = (req, res, next) => {
            if (typeof req.params.uuid === 'undefined') {
                return next(createHttpError(400, 'uuid has to be defined in the params'));
            }
            workTimesBaseController.delete(req.params.uuid).then((result) => {
                res.status(200).json(result);
            }, (err) => {
                log.error(err);
                next(createHttpError(500, 'Cannot edit WorkTime'));
            });
        };

        return {
            getWorkTimes,
            createWorkTime,
            editWorkTime,
            deleteWorkTime
        };
    }
};