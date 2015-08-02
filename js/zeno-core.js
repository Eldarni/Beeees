/* Zeno Core v1.0.0 - Zeno Utilities */

//============================================================
// ZENO PROTOTYPES
//============================================================

//add a new function to jquery to allow is to get the name of the element (uses the input type="" in case of form elements)
$.fn.getType = function() { return this[0].tagName == 'INPUT' ? $(this[0]).attr('type').toLowerCase() : this[0].tagName.toLowerCase(); };

//add a compact way to call native jquery funtions on an collection - depending on a test expression
$.fn.iif = function(boolean, onTrue, onFalse) { if (boolean === true) { return this[onTrue](); } else { return this[onFalse](); } };

//add a more semantically obvious way to see if there are any matches
$.fn.exists = function() { return ((this.length >= 1) ? true : false); };

// object.watch polyfill - 2012-04-03 - By Eli Grey, http://eligrey.com - Public Domain. - NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
Object.prototype.watch||Object.defineProperty(Object.prototype,"watch",{enumerable:!1,configurable:!0,writable:!1,value:function(e,t){var r=this[e],n=r,c=function(){return n},i=function(c){return r=n,n=t.call(this,e,r,c)};delete this[e]&&Object.defineProperty(this,e,{get:c,set:i,enumerable:!0,configurable:!0})}});
Object.prototype.unwatch||Object.defineProperty(Object.prototype,"unwatch",{enumerable:!1,configurable:!0,writable:!1,value:function(e){var t=this[e];delete this[e],this[e]=t}});

//add support to store and retrieve object's via local storage
Storage.prototype.setObject = function(key, obj) { return this.setItem(key, JSON.stringify(obj)); };
Storage.prototype.getObject = function(key) { return JSON.parse(this.getItem(key)); };

//add a replace all to the string object - nasty (but awesome) prototypes
String.prototype.replaceAll = function(search, replace) { return (replace === undefined) ? this : this.replace(new RegExp('[' + search + ']', 'g'), replace); };

//============================================================
// ZENO CORE METHODS
//============================================================

/**
 * Make an ajax request to the server
 * @param  {string}   url  Required - The target endpoint
 * @param  {object}   data    Optional - Any information to be passed as post request
 * @param  {function} success Optional - A callback to be executed on recipt of a succesful status
 * @param  {function} error   Optional - A callback to be executed on recipt of a error status
 * @return {void}
 */
function zeno_ajax_request(url, data, success_callback, error_callback) {
    $.ajax({ 'url': url, 'type': 'post', 'data': data, 'dataType' : 'json', 'timeout': 60000,
        success: function(response) {
            if (response.status == 'success') { if (typeof success_callback !== 'undefined') { success_callback(response); } }
            if (response.status == 'error')   { if (typeof error_callback   !== 'undefined') { error_callback(response);   } }
        },
        error: function(response) {
            if (typeof error_callback !== 'undefined') { error_callback(response); }
        }
    });
}

/**
 * Format a number (',' to seperate 1000's)
 * @param  {mixed}  number Required - The number to format
 * @return {string}
 */
function zeno_format_number(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


/**
 * Get the next value in the list -  automatically rolls around at the end of the haystack
 * @param  {string} needle   Required - The current value to be moved along
 * @param  {array}  haystack Required - An array containing the full cycle of elements
 * @return {string}
 */
function zeno_cycle(needle, haystack) {
    haystack.push(haystack[0]); for (var i in haystack) { if (haystack[i] == needle) { return haystack[(parseInt(i) + 1)]; }}
}

/**
 * Manage the "state" of an element, gets the next state in the queue each time its called
 * @param  {object} $element    Required - A jquery object where the state is stored
 * @param  {string} state_name  Required - The name of the state (to allow multiple states on one object)
 * @param  {array}  state_order Required - An array of possible states, if no states is found the first value is the initial
 * @return {string}
 */
function zeno_toggle_state($element, state_name, state_order) {
    $element.data('zeno-state-' + state_name, (new_state = zeno_cycle(($element.data('zeno-state-' + state_name) || state_order[0]), state_order)));
    return new_state;
}


/**
 * Simple micro template system, based off John Resig's original function and other user contributions
 * @param  {string} template Required - The id of the template to render
 * @param  {object} data     Optional - The data to pass into the template renderer
 * @return {string}
 */
function zeno_template(template, data) {

    //create a cachable name for the compiled template
    var template_name = 'zeno-template-cache-' + template;

    //check to see if we already did this one - if not compile it
    if (typeof (window[template_name]) == 'undefined') {

        //get the template markup
        template = document.getElementById(template).innerHTML;

        //go mad and replace things
        template = template.replace(/[\r\t\n]/g, " ");
        template = template.replace(/'(?=[^%]*\]\])/g, "\t");
        template = template.replace(/'/g, "\\'");
        template = template.replace(/\t/g, "'");
        template = template.replace(/\[\[=(.+?)\]\]/g, "',$1,'");
        template = template.replace(/\[\[/g, "');");
        template = template.replace(/\]\]/g, "p.push('");

        //wrap it in a function so we can cache it for later use
        window[template_name] = new Function('data', "var p = [], print = function() { p.push.apply(p, arguments); }; with(data) { p.push('" + template +  "'); } return p.join('');");
    }

    //return the rendered html
    return window[template_name](data || {});
}

/**
 * Set the value from a single :input field - handles selects/checkboxes/radion buttons correctly
 * @param  {object} $element Required - A jquery object for the field
 * @param  {mixed}  value    Required - The value of the field
 * @return {mixed}
 */
function zeno_set_input_value($element, value) {
    switch ($element.getType()) {
        case 'select': $element.find('option[value="' + value +'"]').prop('selected', true).trigger('change'); break;
        case 'radio': case 'checkbox': if ($element.is('[value="' + value + '"]')) { $element.prop('checked', true).trigger('change'); }; break;
        default: $element.val(value).trigger('change'); break;
    }
}

/**
 * Get the value from a single :input field
 * @param  {object} $field Required - The jquery object for the field in question
 * @return {mixed}
 */
function zeno_get_input_value($field) {
    switch ($field.getType()) {
        case 'select':   return $field.find('option:selected').val();
        case 'radio':    return $field.filter(':checked').val();
        case 'checkbox': return $field.filter(':checked').val();
        default:         return $field.val();
    }
}

/**
 * Gets all the values from any input fields inside a $element - optionally filtered by fieldlist
 * @param  {object} $element  Required - The jquery object for the parent element that holds all the :inputs
 * @param  {object} fieldlist Required - An array of :input[names=""] value to additionally filter the response
 * @return {object}
 */
function zeno_get_input_values($element, fieldlist) {
    if (typeof fieldlist === 'undefined') {
        fieldlist = $element.find(':input, select, textarea').map(function() { return $(this).attr('name'); }).get();
    }
    var form_data = {}; for (var field in fieldlist) {
        $input_element = $element.find('[name="' + fieldlist[field] + '"]');
        form_data[fieldlist[field]] = String(zeno_get_input_value($input_element)).trim();
    }
    return form_data;
}

/**
 * Resets the form contained withing $form, allows a reset to an arbitrary default state 
 * @param  {object}   $form            Required - The jquery object for the parent element that holds all the inputs
 * @param  {bool}     reset_to_default Required - Reset to any [data-default] options instead of just clearing the form (default: false)
 * @param  {function} callback         Required - A function to be called after a form has been reset (Default: undefined)
 * @return {void}
 */
function zeno_reset_form($form, reset_to_default, callback) {

    //reset everything back to an empty state
    $form.find(':selected, :checked').prop('selected', false).prop('checked', false);
    $form.find(':input, textarea').val('');
    
    //if needed look at the data-default and update to that state
    if (reset_to_default === true) {
        $form.find('[data-default="selected"], [data-default="checked"]').prop('selected', true).prop('checked', true);
        $form.find(':input[data-default], textarea[data-default]').each(function(){
            var $this = $(this); $this.val($this.data('default'))
        }); 
    }

    //call a user defined callback - useful for further context specific resets
    if (typeof callback === 'function') { callback(); }

    //update the chosen select boxes to reflect the new state
    $form.find('select').trigger('chosen:updated');
}

/**
 * Simple one-way binding using object.prototype.watch
 * @param  {[type]} $wrapper  [description]
 * @param  {[type]} namespace [description]
 * @param  {[type]} object    [description]
 * @return {[type]}           [description]
 */
function zeno_bind($wrapper, namespace, object) {
    var $wrapper = ((!$wrapper.jquery) ? $($wrapper) : $wrapper);
    for (property in object) {
        object.watch(property, function (property, oldval, newval) {
            zeno_update_bound($wrapper, namespace + '.' + property, newval);
        });
    }
    return object;
}


/**
 * Updates the bound field from zeno_bind
 * @param  {[type]} $wrapper [description]
 * @param  {[type]} property [description]
 * @param  {[type]} value    [description]
 * @return {[type]}          [description]
 */
function zeno_update_bound($wrapper, property, value) {
    // var $element = $wrapper.find('[data-binding="' + property + '"]');
    // if ($element.tagName in ['INPUT', 'SELECT', 'TEXTAREA'])
    //     return zeno_set_input_value($element);;
    // }
    $wrapper.find('[data-binding="' + property + '"]').html(value);
}


/**
 * Uses ajax to allow for inline saving of details
 * @param  {[type]} anchor   [description]
 * @param  {[type]} selector [description]
 * @param  {[type]} save_url [description]
 * @return {[type]}          [description]
 */
function zeno_inline_save(anchor, selector, save_url, callback) {

    //setup the anchor and selector etc
    var $anchor = $(anchor);

    //enables the inline editing of general form inputs
    var update_callback = function(event) {

        var $this = $(this); 

        //checkboxes and radios do not have a default value
        if ($this.getType() != 'radio' && $this.getType() != 'checkbox') {

            //if the value has not changed shortcut the return
            if ($this.prop('defaultValue') === $this.val()) {
                return;
            }

            //update the default value
            $this.prop('defaultValue', $this.val());

        }

        //define a success callback
        var update_success = function(response) {
            $this.parents('div.control-group').removeClass('warning').addClass('success');
            if (typeof callback === 'function') { callback($this, response); }
        };

        //and a failed callback
        var update_failed = function(response) {
            $this.parents('div.control-group').removeClass('warning').addClass('error');
            zeno_alert('error', response.message);
        };

        //send the request to update the members record
        zeno_ajax_request(save_url, {'field' : $this.attr('name'), 'value' : zeno_get_input_value($this)}, update_success, update_failed);  
    };

    //attach the main event
    $anchor.on('blur',   selector + ' div:not(.chosen-search) > input:not(:disabled):not(.input-locked)',                  update_callback);
    $anchor.on('change', selector + ' div:not(.chosen-search) > input[type="radio"]:not(:disabled):not(.input-locked)',    update_callback);
    $anchor.on('change', selector + ' div:not(.chosen-search) > input[type="checkbox"]:not(:disabled):not(.input-locked)', update_callback);
    $anchor.on('change', selector + ' div:not(.chosen-search) > select:not(:disabled):not(.input-locked)',                 update_callback);

    //add some styling to a field as it is getting edited
    $anchor.on('keypress change', selector + ' :input:not(:disabled):not(.input-locked):not(button)', function(event) {
        $this = $(this); if ([9, 13, 37, 38, 39, 40].indexOf(event.keyCode) == -1) {
            $this.parents('div.control-group').removeClass('error success').addClass('warning');
        }
    });
}