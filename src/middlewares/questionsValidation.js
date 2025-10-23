const { body, validationResult } = require('express-validator');

exports.validateNewQuestion = [
   
    body('text')
        .exists({ checkFalsy: true }).withMessage('Question text is required.')
        .isString().withMessage('Question text must be a string.')
        .trim().isLength({ min: 5, max: 500 }).withMessage('Question text must be between 5 and 500 characters.'),

    // Difficulty
    body('difficulty')
        .exists({ checkFalsy: true }).withMessage('Difficulty is required.')
        .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be one of [Easy, Medium, or Hard].'),

    // Options 
    body('options')
        .isArray({ min: 2 }).withMessage('Options must be an array with at least 2 items.'),
    
    
    body('options.*')
        .isString().withMessage('Each option must be a string.')
        .trim().isLength({ min: 1, max: 100 }).withMessage('Each option must be between 1 and 100 characters.'),

    //Correct Answer Index
    body('correctAnswerIndex')
        .exists().withMessage('Correct answer index is required.')
        .isInt({ min: 0 }).withMessage('Correct answer index must be a non-negative integer.')
        .custom((value, { req }) => {
            // Custom check: ensure index is within the bounds of the provided options array
            const optionsLength = req.body.options ? req.body.options.length : 0;
            if (value >= optionsLength) {
                throw new Error('Correct answer index is out of bounds for the provided options array.');
            }
            return true;
        })
];


exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(err => err.msg);

        return res.status(400).json({
            message: 'Validation failed',
            errors: extractedErrors
        });
    }
    
    next();
};