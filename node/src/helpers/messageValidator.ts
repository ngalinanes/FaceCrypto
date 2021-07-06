export class MessageValidator {
    /**
     * messageFormat
     *
     * @static
     * @param {string} field
     * @param {string} customMessage
     * @param {string} [option]
     * @returns {string}
     * @memberof MessageValidator
     */
    static messageFormat(field: string, customMessage: string, option = '') {
        const fieldSplited = field.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
        const opt =
            option != undefined ? option.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase() : null;
        if (opt) {
            return `${fieldSplited} ${customMessage} ${opt}`;
        }
        return `${fieldSplited} ${customMessage}`;
    }
    /**
     * isRequired
     *
     * @param {string} field
     * @returns {string}
     * @memberof MessageValidator
     */
    static isRequired(field: string) {
        return this.messageFormat(field, 'es requerido');
    }
    /**
     * isInt
     *
     * @param {string} field
     * @returns {string}
     * @memberof MessageValidator
     */
    static isInt(field: string) {
        return this.messageFormat(field, 'tiene que ser un número entero');
    }
    /**
     * isString
     *
     * @param {string} field
     * @returns {string}
     * @memberof MessageValidator
     */
    static isString(field: string) {
        return this.messageFormat(field, 'tiene que ser una cadena de caracteres');
    }
    /**
     * isDecimal
     *
     * @static
     * @param {string} field
     * @returns {string}
     * @memberof MessageValidator
     */
    static isDecimal(field: string) {
        return this.messageFormat(field, 'tiene que ser de tipo decimal');
    }
    /**
     * isDecimal
     *
     * @static
     * @param {string} field
     * @returns {string}
     * @memberof MessageValidator
     */
    static isBoolean(field: string) {
        return this.messageFormat(field, 'tiene que ser de tipo boolean');
    }
    /**
     * isLength
     *
     * @param {string} field
     * @param {number} maxLength
     * @returns {string}
     * @memberof MessageValidator
     */
    static maxLength(field: string, maxLength: string) {
        const message = `no puede tener más de ${maxLength} caracteres`;
        return this.messageFormat(field, message);
    }
    /**
     * minLength
     *
     * @static
     * @param {string} field
     * @param {number} minLength
     * @returns {string}
     * @memberof MessageValidator
     */
    static minLength(field: string, minLength: string) {
        const message = `no puede tener menos de ${minLength} caracteres`;
        return this.messageFormat(field, message);
    }
    /**
     *
     *
     * @static
     * @param {String} field
     * @param {Number} minLength
     * @param {Number} maxLength
     * @returns
     * @memberof MessageValidator
     */
    static betweenLength(field: string, minLength: string, maxLength: string) {
        const message = `tiene que ser entre ${minLength} y ${maxLength} caracteres`;
        return this.messageFormat(field, message);
    }
    /**
     * isLength
     *
     * @param {string} field
     * @param {number} maxLength
     * @returns {string}
     * @memberof MessageValidator
     */
    static maxArrayLength(field: string, maxLength: string) {
        const message = `no puede tener más de ${maxLength} elementos`;
        return this.messageFormat(field, message);
    }
    /**
     * minLength
     *
     * @static
     * @param {string} field
     * @param {number} minLength
     * @returns {string}
     * @memberof MessageValidator
     */
    static minArrayLength(field: string, minLength: string) {
        const message = `no puede tener menos de ${minLength} elementos`;
        return this.messageFormat(field, message);
    }
    /**
     *
     *
     * @static
     * @param {String} field
     * @param {Number} minLength
     * @param {Number} maxLength
     * @returns
     * @memberof MessageValidator
     */
    static betweenArrayLength(field: string, minLength: string, maxLength: string) {
        const message = `tiene que contener entre ${minLength} y ${maxLength} elementos`;
        return this.messageFormat(field, message);
    }
    /**
     * incorrect
     *
     * @param {string} field
     * @returns {string}
     * @memberof MessageValidator
     */
    static incorrect(field: string) {
        return this.messageFormat(field, 'incorrecto');
    }
    /**
     * inUse
     *
     * @static
     * @param {string} field
     * @returns {string}
     * @memberof MessageValidator
     */
    static inUse(field: string) {
        return this.messageFormat(field, 'ya está en uso');
    }
    /**
     * hasRelateditems
     *
     * @static
     * @param {string} field
     * @param {string} items
     * @returns {string}
     * @memberof MessageValidator
     */
    static hasRelatedItems(field: string, items: string) {
        return this.messageFormat(field, 'tiene relacionados', items);
    }
    /**
     * mustBeOfType
     *
     * @static
     * @param {string} field
     * @param {string} type
     * @returns {string}
     * @memberof MessageValidator
     */
    static mustBeOfType(field: string, type: string) {
        return this.messageFormat(field, 'tiene que ser de tipo', type);
    }
    /**
     * arrayEmpty
     *
     * @static
     * @param {string} field
     * @returns {string}
     * @memberof MessageValidator
     */
    static arrayEmpty(field: string) {
        return this.messageFormat(field, 'array vacío');
    }
    /**
     * isEmpty
     *
     * @static
     * @param {string} field
     * @returns {string}
     * @memberof MessageValidator
     */
    static isEmpty(field: string) {
        return this.messageFormat(field, 'no puede estar vacío');
    }
}