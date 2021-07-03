function Validator(formSelector) {
    var _this = this //ES5
    var formRules = {};

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement
        }
    }

    var validatorRules = {
        required: function(value) {
            return value ? undefined : 'Cannot be empty'           
        },
        email: function(value) {
            var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
            return emailRegex ? undefined : 'Invalid email';           
        },
        min: function(min) {
            return function (value) {
                return value.length >= min ? undefined : `Min lenghth is ${min}`
            }                  
        },
        max: function(max) {
            return function (value) {
                return value.length < max ? undefined : `Min lenghth is ${min}`
            }                  
        }
    }

    var formElement = document.querySelector(formSelector)
    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');
        for (var input of inputs) {
            var rules = input.getAttribute('rules').split('|')
            for (var rule of rules) {
                var isRuleHasValue = rule.includes(':');
                var ruleFunction;
                if (!isRuleHasValue) {
                    ruleFunction = validatorRules[rule];
                } else {
                    var ruleInfo = rule.split(':');
                    rule = ruleInfo[0]
                    ruleFunction = validatorRules[rule](ruleInfo[1])
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunction)
                } else {
                    formRules[input.name] = [ruleFunction];
                }                
            }
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }        
        function handleValidate(event) {
            var rules = formRules[event.target.name];   
            var errorMessage;
            for (var rule of rules) {
                errorMessage = rule(event.target.value)
                if (errorMessage) break;
            } 

            if (errorMessage) {
                var formGroup = getParent(event.target, '.form-group');
                if (!formGroup) return;
                formGroup.classList.add('invalid')
                var formMessage = formGroup.querySelector('.form-message');
                    if (formMessage) {
                        formMessage.innerHTML = errorMessage
                }
            }

            return !errorMessage
        }
        function handleClearError(event) {
            var formGroup = getParent(event.target, '.form-group');
            if (!formGroup) return;
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');
                var formMessage = formGroup.querySelector('.form-message');
                if (formMessage) {
                    formMessage.innerHTML = ''
                }
            }
        }
    }

    formElement.onsubmit = function (event) {
        event.preventDefault();
        var inputs = formElement.querySelectorAll('[name][rules]');
        var isFormValid = true;
        for (var input of inputs) {
            if (!handleValidate({target: input})) {
                isFormValid = false;
            }
        }
        
        if (isFormValid) {
           if (typeof _this.onSubmit === 'function') {
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
            return _this.onSubmit(formValues)
           } 
           formElement.submit();
        }
    }
}