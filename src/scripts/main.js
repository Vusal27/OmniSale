const form = document.querySelector('.form');  // Форма
const send = document.querySelector('.form__btn');  // Кнопка войти
const checked = document.querySelector('.form__input-checked');  // Галочка подтверждающая валидность телефона
const checkbox = document.querySelector('.form__input-checkbox');  // Чекбокс "Запомнить"

// Форма
send.addEventListener('click', submit);

function submit(event) {
    event.preventDefault();
    let data = {};
    // Записываем данные из формы в объект data
    for (let i = 0; i < form.length; i++) {
        let formInput = form[i];
        if (formInput.name) {
            data[formInput.name] = formInput.value;
        }
    };
    // Ajax
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'url', true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = () => {
        if (xhr.readyState != 4) return;
        else {
            if (xhr.status === 200) {
                alert(xhr.responseText);
            } else {
                alert(`${xhr.status}: ${xhr.statusText}`);
            }
        }
    }

    ValueToCookie(form);
    autofill();
    checkbox.checked = false;
}

// Записываем значения полей формы в куки(если включен checkbox "запомнить")
function ValueToCookie(form) {
    if (checkbox.checked) {
        for (var i = 0; i < form.length; i++) {
            if (form[i].name) {
                document.cookie = `${form[i].name}=${form[i].value}`;  
            }
        };
    }
}

// Автозаполнение сохраненных данных
function autofill() {

    if (document.cookie !== '') {
        // Записываем в объект obj данные из куки
        let obj = document.cookie.split('; ').reduce((prev, current) => {
            const [cookieName, cookieValue] = current.split('=');
            prev[cookieName] = cookieValue;
            return prev;
        }, {});
        // Значения свойств объекта obj присваиваем полям формы
        for (key in obj) {
            for (var i = 0; i < form.length; i++) {
                if (form[i].name) {
                    if (form[i].name === key) {
                        form[i].value=obj[key];
                        checked.style.display='block';
                        send.disabled = false;
                    }
                }
            }
        };
    } else {
        // Сохраненных данных нет, очищаем поля
        for (var i = 0; i < form.length; i++) {
            form[i].value='';
        };
        checked.style.display='none';
        send.disabled = true;
    }
}
autofill();

// Активность кнопки отправки
form.addEventListener('keyup', event => {
    let target = event.target;
    if (target.classList.contains('form__input')) {
        if (validate(form)) {
            send.disabled = false;
        } else {
            send.disabled = true;
        }
    }
});

// Валидация
function validate(form) {
    let valid = true;
    let elems = form.elements;
    const regPhone = /8\s?[\(]{0,1}9[0-9]{2}[\)]{0,1}\s?\d{3}[-]{0,1}\d{2}[-]{0,1}\d{2}/;  // Регулярное выражение для поля phone
    const regPassword = /(?=^.{5,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*/;  // Регулярное выражение для поля password
    let phoneValid = regPhone.test(elems.phone.value);
    let passwordValid = regPassword.test(elems.password.value);
    
    // По умолчанию удаляем стили ошибок
    elems.phone.nextElementSibling.style.display = 'none';
    elems.phone.style.color='';
    elems.password.nextElementSibling.style.display = 'none';
    elems.phone.nextElementSibling.nextElementSibling.style.display = 'none';

    // Валидация поля phone
    if (!phoneValid && elems.phone.value.length!=0) {
        elems.phone.nextElementSibling.style.display = 'flex';
        elems.phone.style.color='#b40000';
        valid = false;
    } else if (elems.phone.value.length===0) {
        valid = false;
    } else if (phoneValid) {
        elems.phone.nextElementSibling.nextElementSibling.style.display = 'block';
    }

    // Валидцая поля password
    if (!passwordValid && elems.password.value.length!==0) {
        elems.password.nextElementSibling.style.display = 'flex';
        valid = false;
    } else if (elems.password.value.length===0) {
        valid = false;
    }
    
    return valid;
}

// Удаляем атрибуты required и pattern, так как они написаны на случай отключенного js
function delAttributes() {
    form.elements.phone.removeAttribute('required');
    form.elements.phone.removeAttribute('pattern');
    form.elements.password.removeAttribute('required');
    form.elements.password.removeAttribute('pattern');
}
delAttributes();

// Blur
function blurFunc() {
    let blur = (function () {
        const wrapper = document.querySelector('.log-block'),  // Обёртка формы
            blur = document.querySelector('.log-block__blur'); // Фон формы

        return {
            set: function () {
                let imgWidth = document.querySelector('.main').offsetWidth, // Ширина фона страницы
                    posLeft = -wrapper.offsetLeft, // Позиция формы относительно левого края окна браузера, с отрицательным значением
                    posTop = -wrapper.offsetTop,  // Позиция формы относительно верхнего края окна браузера, с отрицательным значением
                    blurCSS = blur.style;
                    
                // Если браузер IE, меняем картинку(ie не поддерживает filter:blur)
                if (navigator.userAgent.search(/MSIE/) > 0 || navigator.userAgent.search(/NET CLR /) > 0) {
                    blurCSS.background="url(../images/background/bg-blur-ie.png)";
                    blurCSS.backgroundSize=`100vw 100vh`;
                    if (imgWidth>767) { // большие разрешения
                        blurCSS.backgroundPosition = `${posLeft}px ${posTop}px`;
                    } else {  // планшеты и мобильные разрешения
                        blurCSS.backgroundPosition = `50% ${posTop}px`;
                        blurCSS.backgroundSize=`960px 100vh`;
                    }
                } else { // В остальных случаях применяем filter:blur
                    if (imgWidth>767) {  // большие разрешения
                        blurCSS.backgroundPosition = `${posLeft}px ${posTop}px`;
                    } else {  // планшеты и мобильные разрешения
                        blurCSS.backgroundPosition = `50% ${posTop}px`;
                    }
                }
            }
        }
    }());

    blur.set();
    // Запускаем функцию при изменении размера окна браузера
    window.onresize = () => {
        blur.set();
    }
}

blurFunc();