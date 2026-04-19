/**
 * Recursively flattens nested API error objects/arrays from Django REST Framework
 * into a flat array of {key, message} pairs.
 */
export const flattenApiErrors = (value, parentKey = '') => {
    if (Array.isArray(value)) {
        return value.flatMap((item) => {
            if (item && typeof item === 'object') {
                return flattenApiErrors(item, parentKey);
            }
            return [{ key: parentKey, message: String(item) }];
        });
    }

    if (value && typeof value === 'object') {
        return Object.entries(value).flatMap(([key, nested]) => {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            return flattenApiErrors(nested, fullKey);
        });
    }

    return [{ key: parentKey, message: String(value) }];
};

/**
 * Maps Django's specific API error keys to the local React form field names.
 */
export const mapApiKeyToFormField = (apiKey) => {
    const key = apiKey.replace(/^profile\./, '');
    const fieldMap = {
        username: 'username',
        email: 'email',
        role: 'role',
        password: 'password',
        password2: 'confirmPassword',
        fullName: 'username',
        nic_number: 'nic',
        phoneNumber: 'phone',
        blood_group: 'bloodGroup',
        country: 'country',
        district: 'district',
        hospital: 'hospital',
    };
    return fieldMap[key] || null;
};
