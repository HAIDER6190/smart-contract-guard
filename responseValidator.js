// responseValidator.js
function responseValidator(schema) {
    return (res, data) => {
        const errors = [];
        const { body } = schema;
        if (!body) return res.json(data);

        const validate = (key, rules, value) => {
            if (rules.required && (value === undefined || value === null)) {
                errors.push(`${key} is required`);
            }
        };

        for (const key in body) {
            validate(key, body[key], data[key]);
        }

        if (errors.length > 0) {
            throw new Error("Response validation failed: " + errors.join(", "));
        }

        return res.json(data);
    };
}

module.exports = { responseValidator };