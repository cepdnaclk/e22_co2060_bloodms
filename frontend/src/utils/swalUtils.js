import Swal from 'sweetalert2';

// Base configuration shared across all HOPEDROP alerts
const swalBase = {
    customClass: {
        popup:          'swal-hopedrop-popup',
        title:          'swal-hopedrop-title',
        htmlContainer:  'swal-hopedrop-html',
        confirmButton:  'swal-hopedrop-confirm',
        icon:           'swal-hopedrop-icon',
    },
    width: 'clamp(260px, 90vw, 380px)',
    padding: 'clamp(1.2rem, 4vw, 2rem)',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timerProgressBar: true,
};

/**
 * Show a success toast notification
 * @param {string} title 
 * @param {string} text 
 * @param {number} timer 
 */
export const showSuccessToast = (title, text, timer = 2200) => {
    return Swal.fire({
        ...swalBase,
        icon: 'success',
        title,
        text,
        timer,
    });
};

/**
 * Show an error toast notification
 * @param {string} title 
 * @param {string} text 
 * @param {number} timer 
 */
export const showErrorToast = (title, text, timer = 3000) => {
    return Swal.fire({
        ...swalBase,
        icon: 'error',
        title,
        text,
        timer,
    });
};

/**
 * Show a warning toast notification
 * @param {string} title 
 * @param {string} text 
 * @param {number} timer 
 */
export const showWarningToast = (title, text, timer = 2000) => {
    return Swal.fire({
        ...swalBase,
        icon: 'warning',
        title,
        text,
        timer,
    });
};
