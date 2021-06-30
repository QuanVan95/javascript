function Validator(options) {

    var selectorRules = {}

    function validate(inputElement, rule) {
        var errorMessage;
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        var rules = selectorRules[rule.selector]
      
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value)
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerHTML = errorMessage
            inputElement.parentElement.classList.add('invalid')
        } else {
            inputElement.parentElement.classList.remove('invalid')
            errorElement.innerHTML = ''
        }
    
        return !errorMessage
    }

    var formElement = document.querySelector(options.form);
    if (formElement) {
        formElement.onsubmit = function(e) {
            e.preventDefault();
            var isFormValid = true;
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            })

            if (isFormValid) {
                //Case submit with JS
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disable])'); //Type: NodeList
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {                        
                        return (values[input.name] = input.value) && values;
                    }, {});
                    options.onSubmit(formValues)
                } else {
                    //Submit with default way
                    formElement.submit()
                }
            }
        }

        options.rules.forEach(function(rule) {
            //Save rules
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            } 
            var inputElement = formElement.querySelector(rule.selector)
            if (inputElement) {
                //Blur outside the input
                inputElement.onblur = function() {
                    validate(inputElement, rule);
                }

                //Input
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    inputElement.parentElement.classList.remove('invalid')
                    errorElement.innerHTML = ''
                }
            }
        })
    }
}

Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || 'Cannot be empty'
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
            return emailRegex ? undefined : message || 'Invalid email';
        }
    }
}

Validator.minLength = function(selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message || `Min length is ${min}`;
        }
    }
}

Validator.isConfirmPassword = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Input is not the same'
        }
    }
}