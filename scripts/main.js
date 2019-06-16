var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
var form = document.querySelector('.form');
var send = document.querySelector('.form__btn');
var checked = document.querySelector('.form__input-checked');
var checkbox = document.querySelector('.form__input-checkbox');
send.addEventListener('click', submit);
function submit(event) {
    event.preventDefault();
    var data = {};
    for (var i = 0; i < form.length; i++) {
        var formInput = form[i];
        if (formInput.name) {
            data[formInput.name] = formInput.value;
        }
    };
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'url', true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;else {
            if (xhr.status === 200) {
                alert(xhr.responseText);
            } else {
                alert(xhr.status + ': ' + xhr.statusText);
            }
        }
    };
    ValueToCookie(form);
    autofill();
    checkbox.checked = false;
}
function ValueToCookie(form) {
    if (checkbox.checked) {
        for (var i = 0; i < form.length; i++) {
            if (form[i].name) {
                document.cookie = form[i].name + '=' + form[i].value;
            }
        };
    }
}
function autofill() {
    if (document.cookie !== '') {
        var obj = document.cookie.split('; ').reduce(function (prev, current) {
            var _current$split = current.split('='),
                _current$split2 = _slicedToArray(_current$split, 2),
                cookieName = _current$split2[0],
                cookieValue = _current$split2[1];

            prev[cookieName] = cookieValue;
            return prev;
        }, {});
        for (key in obj) {
            for (var i = 0; i < form.length; i++) {
                if (form[i].name) {
                    if (form[i].name === key) {
                        form[i].value = obj[key];
                        checked.style.display = 'block';
                        send.disabled = false;
                    }
                }
            }
        };
    } else {
        for (var i = 0; i < form.length; i++) {
            form[i].value = '';
        };
        checked.style.display = 'none';
        send.disabled = true;
    }
}
autofill();
form.addEventListener('keyup', function (event) {
    var target = event.target;
    if (target.classList.contains('form__input')) {
        if (validate(form)) {
            send.disabled = false;
        } else {
            send.disabled = true;
        }
    }
});
function validate(form) {
    var valid = true;
    var elems = form.elements;
    var regPhone = /8\s?[\(]{0,1}9[0-9]{2}[\)]{0,1}\s?\d{3}[-]{0,1}\d{2}[-]{0,1}\d{2}/;
    var regPassword = /(?=^.{5,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*/;
    var phoneValid = regPhone.test(elems.phone.value);
    var passwordValid = regPassword.test(elems.password.value);
    elems.phone.nextElementSibling.style.display = 'none';
    elems.phone.style.color = '';
    elems.password.nextElementSibling.style.display = 'none';
    elems.phone.nextElementSibling.nextElementSibling.style.display = 'none';
    if (!phoneValid && elems.phone.value.length != 0) {
        elems.phone.nextElementSibling.style.display = 'flex';
        elems.phone.style.color = '#b40000';
        valid = false;
    } else if (elems.phone.value.length === 0) {
        valid = false;
    } else if (phoneValid) {
        elems.phone.nextElementSibling.nextElementSibling.style.display = 'block';
    }
    if (!passwordValid && elems.password.value.length !== 0) {
        elems.password.nextElementSibling.style.display = 'flex';
        valid = false;
    } else if (elems.password.value.length === 0) {
        valid = false;
    }
    return valid;
}
function delAttributes() {
    form.elements.phone.removeAttribute('required');
    form.elements.phone.removeAttribute('pattern');
    form.elements.password.removeAttribute('required');
    form.elements.password.removeAttribute('pattern');
}
delAttributes();
function blurFunc() {
    var blur = function () {
        var wrapper = document.querySelector('.log-block'),
        blur = document.querySelector('.log-block__blur');
        return {
            set: function set() {
                var imgWidth = document.querySelector('.main').offsetWidth,
                posLeft = -wrapper.offsetLeft,
                posTop = -wrapper.offsetTop,
                blurCSS = blur.style;
                if (navigator.userAgent.search(/MSIE/) > 0 || navigator.userAgent.search(/NET CLR /) > 0) {
                    blurCSS.background = "url(./images/background/bg-blur-ie.png)";
                    blurCSS.backgroundSize = '100vw 100vh';
                    if (imgWidth > 767) {
                        blurCSS.backgroundPosition = posLeft + 'px ' + posTop + 'px';
                    } else {
                        blurCSS.backgroundPosition = '50% ' + posTop + 'px';
                        blurCSS.backgroundSize = '960px 100vh';
                    }
                } else {
                    if (imgWidth > 767) {
                        blurCSS.backgroundPosition = posLeft + 'px ' + posTop + 'px';
                    } else {
                        blurCSS.backgroundPosition = '50% ' + posTop + 'px';
                    }
                }
            }
        };
    }();
    blur.set();
    window.onresize = function () {
        blur.set();
    };
}
blurFunc();