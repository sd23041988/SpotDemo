// config.js

// LeadSquared Form Schema Mapping and Validation Rules

const leadSquaredSchema = {
    form: {
        fields: [
            {
                name: 'firstName',
                type: 'text',
                required: true,
                validation: {
                    type: 'string',
                    maxLength: 50
                }
            },
            {
                name: 'lastName',
                type: 'text',
                required: true,
                validation: {
                    type: 'string',
                    maxLength: 50
                }
            },
            {
                name: 'email',
                type: 'email',
                required: true,
                validation: {
                    type: 'string',
                    format: 'email'
                }
            },
            {
                name: 'phone',
                type: 'tel',
                required: false,
                validation: {
                    type: 'string',
                    pattern: '^\\+?\\d{10,15}$'
                }
            }
        ]
    }
};

module.exports = leadSquaredSchema;
