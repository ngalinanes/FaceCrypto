import {
    validationResult
} from 'express-validator';

export const requestValidate = (validations: any) => {
    return async (req: any, res: any, next: any) => {
        await Promise.all(validations.map((validation: any) => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(422).json({
            errors: errors.array()
        });
    }
};