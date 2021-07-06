export class MessageResponse {
    /**
     * messageFormat
     *
     * @static
     * @param {string} field
     * @param {string} customMessage
     * @returns {string}
     * @memberof MessageResponse
     */
    static messageFormat(customMessage: string) {
        return `${customMessage}`;
    }
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof MessageResponse
     */
    static generalError() {
        return this.messageFormat('Ocurrió un error durante el proceso');
    }
    /**
     *
     *
     * @static
     * @param {string} error
     * @returns {string}
     * @memberof MessageResponse
     */
    static serviceCatch(error: string) {
        return this.messageFormat(error);
    }

    /////// ***************************** PROCESS MESSAGES 
    /**
     *
     *
     * @returns {string}
     * @memberof MessageResponse
     */
    static isUploaded() {
        return this.messageFormat('Upload exitoso');
    }
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof MessageResponse
     */
    static notUploaded() {
        return this.messageFormat('Ocurrió un error durante el upload');
    }
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof MessageResponse
     */
    static missingParam(value: string) {
        return this.messageFormat(`Parametro ${value} faltante`);
    }

    /////// ***************************** DB MESSAGES 

    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof MessageResponse
     */
    static notFound() {
        return this.messageFormat('Registro no encontrado');
    }
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof MessageResponse
     */
    static dbError() {
        return this.messageFormat('Error de database');
    }

    /////// ***************************** USER MESSAGES

    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof MessageResponse
     */
    static unauthorized() {
        return this.messageFormat('Usted no está autorizado');
    }
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof MessageResponse
     */
    static missingToken() {
        return this.messageFormat('No se pudo parsear el token');
    }
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof MessageResponse
     */
    static registerSuccess() {
        return this.messageFormat('Registro exitoso');
    }
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof MessageResponse
     */
    static registerFail() {
        return this.messageFormat('No se pudo registrar el usuario');
    }
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof MessageResponse
     */
    static routeProtected() {
        return this.messageFormat('Ruta protegida');
    }

}