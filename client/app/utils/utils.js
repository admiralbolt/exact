import { Promise } from 'rsvp';

export function closeNavMenu() {
  // Close the nav menu by sending the 'closeNavigation' event.
  document.dispatchEvent(new Event('closeNavigation'));
  // Remove the aria expanded attribute from the nav-menu buttton.
  document.getElementById('dcf-menu-toggle').removeAttribute('aria-expanded');
}

// Format errors in a sane way. Errors from the backend come in as an object
// that map the model field -> array of error messages. i.e.:
// {'description': ['This field is required', ...]}
export function formatErrors(errors) {
  let errorString = "";
  // If errors is an array, an internal server error happened.
  if (Array.isArray(errors)) {
    errors.forEach(error => {
      errorString += `Server Error: ${error.status}. Does the resource already exist?`;
    });
    return errorString;
  }

  for (let property in errors) {
    if (Array.isArray(errors[property])) {
      errors[property].forEach(error => {
        errorString += `Field '${property}' has error: ${error} <br />`;
      });
    } else {
      errorString += `Field '${property}' has error: ${errors[property]} <br />`;
    }
  }
  return errorString;
}


export function formatModelName(modelName) {
  return {
    'geometry': 'Geometry',
    'equation_type': 'Equation Type',
    'equation': 'Equation'
  }[modelName] || modelName;
}

// Deep copy of an object. Function is not recursive and won't handle nested
// keys.
export function copyObject(d) {
  let copy = {};
  for (var prop in d) {
    if (!d.hasOwnProperty(prop)) continue;

    copy[prop] = d[prop];
  }

  return copy;
}

// Really bad email validator.
export function validateEmail(email) {
  let re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function handleFetchErrors(response) {
  return new Promise(function(resolve, reject) {
    if (!response.ok) reject(response);

    resolve(response);
  });
}
