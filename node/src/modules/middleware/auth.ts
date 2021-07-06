import {
    MessageResponse
} from "../../helpers/messageResponse";

export const authToken = (req: any, res: any, next: any) => {
    if (!req.user) {
        res.status(401).send(MessageResponse.unauthorized());
    } else {
        next();
    }
}
