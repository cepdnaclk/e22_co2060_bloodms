/**
 * ─── Sri Lanka Location Data ─────────────────────────────────────
 * Countries and their districts with center coordinates for map focus.
 * ──────────────────────────────────────────────────────────────────
 */

const LOCATION_DATA = {
    'Sri Lanka': {
        center: [7.8731, 80.7718],
        zoom: 8,
        districts: [
            { name: 'Ampara',            center: [7.2913, 81.6724] },
            { name: 'Anuradhapura',      center: [8.3114, 80.4037] },
            { name: 'Badulla',           center: [6.9934, 81.0550] },
            { name: 'Batticaloa',        center: [7.7310, 81.6747] },
            { name: 'Colombo',           center: [6.9271, 79.8612] },
            { name: 'Galle',             center: [6.0535, 80.2210] },
            { name: 'Gampaha',           center: [7.0840, 80.0098] },
            { name: 'Hambantota',        center: [6.1429, 81.1212] },
            { name: 'Jaffna',            center: [9.6615, 80.0255] },
            { name: 'Kalutara',          center: [6.5854, 80.1488] },
            { name: 'Kandy',             center: [7.2906, 80.6337] },
            { name: 'Kegalle',           center: [7.2513, 80.3464] },
            { name: 'Kilinochchi',       center: [9.3803, 80.3770] },
            { name: 'Kurunegala',        center: [7.4863, 80.3647] },
            { name: 'Mannar',            center: [8.9810, 79.9044] },
            { name: 'Matale',            center: [7.4675, 80.6234] },
            { name: 'Matara',            center: [5.9549, 80.5550] },
            { name: 'Monaragala',        center: [6.8728, 81.3507] },
            { name: 'Mullaitivu',        center: [9.2671, 80.8142] },
            { name: 'Nuwara Eliya',      center: [6.9497, 80.7891] },
            { name: 'Polonnaruwa',       center: [7.9403, 81.0188] },
            { name: 'Puttalam',          center: [8.0362, 79.8283] },
            { name: 'Ratnapura',         center: [6.6828, 80.3992] },
            { name: 'Trincomalee',       center: [8.5874, 81.2152] },
            { name: 'Vavuniya',          center: [8.7514, 80.4971] },
        ],
    },
};

/**
 * Get the list of available countries.
 */
export const getCountries = () => Object.keys(LOCATION_DATA);

/**
 * Get districts for a given country.
 */
export const getDistricts = (country) => {
    return LOCATION_DATA[country]?.districts || [];
};

/**
 * Get the map center coordinates for a country.
 */
export const getCountryCenter = (country) => {
    const data = LOCATION_DATA[country];
    return data ? { center: data.center, zoom: data.zoom } : { center: [7.8731, 80.7718], zoom: 8 };
};

/**
 * Get the center coordinates for a specific district.
 */
export const getDistrictCenter = (country, districtName) => {
    const districts = LOCATION_DATA[country]?.districts || [];
    const district = districts.find(d => d.name === districtName);
    return district ? district.center : LOCATION_DATA[country]?.center || [7.8731, 80.7718];
};

export default LOCATION_DATA;
