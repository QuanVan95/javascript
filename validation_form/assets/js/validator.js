function Validator(options) {

    function getParent(element, selector) {       
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {}

    function validate(inputElement, rule) {
        var errorMessage;
        var inputParentElement = getParent(inputElement, options.formGroupSelector);
        var errorElement = inputParentElement.querySelector(options.errorSelector)
        var rules = selectorRules[rule.selector]
        for (let validateRule of rules) {
            switch(inputElement.type) {
                case 'checkbox':
                case 'radio':    
                    errorMessage = validateRule(
                        formElement.querySelector(rule.selector + ':checked')
                    )
                    break;
                default:
                    errorMessage = validateRule(inputElement.value)
            }
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerHTML = errorMessage
            inputParentElement.classList.add('invalid')
        } else {
            inputParentElement.classList.remove('invalid')
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
                var inputElement = formElement.querySelector(rule.selector) //Get NodeList                
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
                        switch(input.type) {
                            case 'radio':
                                if (!input.matches(':checked')) return values;                    
                                values[input.name] = input.value;
                                break;
                            case 'checkbox':                                
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                if (!input.matches(':checked')) return values;
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
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
            var inputElements = formElement.querySelectorAll(rule.selector)
            Array.from(inputElements).forEach(function(inputElement) {
                var inputParentElement = getParent(inputElement, options.formGroupSelector);
                if (inputElement) {
                    //Blur outside the input
                    inputElement.onblur = function() {
                        validate(inputElement, rule);
                    }
    
                    //Input
                    inputElement.oninput = function() {
                        var errorElement = inputParentElement.querySelector(options.errorSelector)
                        inputParentElement.classList.remove('invalid')
                        errorElement.innerHTML = ''
                    }
                }
            })        
        })
    }
}

Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined : message || 'Cannot be empty'
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