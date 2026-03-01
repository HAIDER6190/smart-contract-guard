// validator.js

function validateField(key, rules, value, path = "") {
    const errors = [];
    const name = path ? `${path}.${key}` : key;

    if (rules.required && (value === undefined || value === null)) {
        errors.push(`${name} is required`);
        return errors;
    }

    // Skip undefined optional
    if (value === undefined || value === null) return errors;

    // Check type
    if (rules.type) {
        if (rules.type === "array") {
            if (!Array.isArray(value)) errors.push(`${name} must be an array`);
        } else if (rules.type === "object") {
            if (typeof value !== "object" || Array.isArray(value))
                errors.push(`${name} must be an object`);
        } else if (typeof value !== rules.type) {
            errors.push(`${name} must be a ${rules.type}`);
        }
    }

    // Enum
    if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${name} must be one of [${rules.enum.join(", ")}]`);
    }

    // Strings
    if (rules.type === "string") {
        if (rules.min && value.length < rules.min)
            errors.push(`${name} must be at least ${rules.min} chars`);
        if (rules.max && value.length > rules.max)
            errors.push(`${name} must be at most ${rules.max} chars`);
    }

    // Numbers
    if (rules.type === "number") {
        if (rules.min && value < rules.min)
            errors.push(`${name} must be >= ${rules.min}`);
        if (rules.max && value > rules.max)
            errors.push(`${name} must be <= ${rules.max}`);
    }

    // Nested objects
    if (rules.type === "object" && rules.properties) {
        for (const subKey in rules.properties) {
            errors.push(
                ...validateField(subKey, rules.properties[subKey], value[subKey], name)
            );
        }
    }

    // Arrays with items
    if (rules.type === "array" && rules.items) {
        if (Array.isArray(value)) {
            value.forEach((item, i) => {
                errors.push(...validateField(i, rules.items, item, name));
            });
        }
    }

    return errors;
}

function requestValidator(contract) {
    return (req, res, next) => {
        const errors = [];

        // Validate body
        if (contract.body) {
            for (const key in contract.body) {
                errors.push(...validateField(key, contract.body[key], req.body[key]));
            }
        }

        // Validate query
        if (contract.query) {
            for (const key in contract.query) {
                errors.push(...validateField(key, contract.query[key], req.query[key]));
            }
        }

        // Validate params
        if (contract.params) {
            for (const key in contract.params) {
                errors.push(...validateField(key, contract.params[key], req.params[key]));
            }
        }

        // Validate headers
        if (contract.headers) {
            for (const key in contract.headers) {
                errors.push(...validateField(key, contract.headers[key], req.headers[key]));
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: "VALIDATION_ERROR",
                messages: errors
            });
        }

        next();
    };
}

module.exports = { requestValidator };